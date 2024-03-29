import {
  Ed25519Keypair,
  GetObjectDataResponse,
  JsonRpcProvider,
  RawSigner,
  SuiTransactionResponse,
  TransactionQuery,
} from "@mysten/sui.js";
import {
  CollectionParser,
  FixedPriceMarketParser,
  FlatFeeParser,
  InventoryParser,
  MarketplaceParser,
  ListingParser,
  MintCapParser,
  NftClient,
} from "../src";

/**
 * All steps needed for a full cycle of NFT creation.
 * Pre-requisites: publish the contract
 * Steps:
 * 1. Create a fee object
 * 2. Initialize launchpad
 * 3. Initialize launchpad slot
 * 4. Create inventory
 * 5. Mint NFTs to intventory
 * 6. Create a market
 * 7. Enale sales for market
 */

export const mnemonic =
  "harvest empty express erase pause bundle clarify box install arena push guard";
export const keypair = Ed25519Keypair.deriveKeypair(mnemonic);

export const provider = new JsonRpcProvider("https://fullnode.devnet.sui.io");
export const signer = new RawSigner(keypair, provider);
export const client = new NftClient(provider);

const GLOBAL_RECEIVER = "0x1c66e815c11de62b17329f58dbedd8331c2fa5b4"; // pubkey
const CONFIG = {
  nftProtocolContractId: "0xa581a7bab1c2cc9b5439d6634dcf8b345567bfdb", // NFT-PROTOCOL
  nftContractId: "0xa581a7bab1c2cc9b5439d6634dcf8b345567bfdb", // SUIGODS
  launchpadAdmin: GLOBAL_RECEIVER,
  launchpadReceiver: GLOBAL_RECEIVER,
  lpSlotAdmin: GLOBAL_RECEIVER,
  lpSlotReceiver: GLOBAL_RECEIVER,
  feesRate: 1000, // bps
  mintTestNFTs: false,
  moduleName: "suimarines", // TODO: parse on the fly
};

const loadAllTxs = async (query: TransactionQuery) => {
  let result: SuiTransactionResponse[] = [];
  let cursor: string | null = null;
  while (true) {
    console.log("Start search by contract...");
    // eslint-disable-next-line no-await-in-loop
    const txIds = await provider.getTransactions(
      query,
      cursor,
      null,
      "descending"
    );
    // eslint-disable-next-line no-await-in-loop
    const txs = await provider.getTransactionWithEffectsBatch(txIds.data);
    result = [...result, ...txs];
    if (!txIds.nextCursor) {
      return result.sort(
        (a, b) => (b.timestamp_ms ?? 0) - (a.timestamp_ms ?? 0)
      );
    }
    cursor = txIds.nextCursor;
  }
};

const resolveFields = async (allObjects: GetObjectDataResponse[]) => {
  const [
    [collection],
    launchpads,
    launchpadSlots,
    fees,
    [mintCap],
    markets,
    inventories,
  ] = await Promise.all([
    client.parseObjects(allObjects, CollectionParser),
    client.parseObjects(allObjects, MarketplaceParser),
    client.parseObjects(allObjects, ListingParser),
    client.parseObjects(allObjects, FlatFeeParser),
    client.parseObjects(allObjects, MintCapParser),
    client.parseObjects(allObjects, FixedPriceMarketParser),
    client.parseObjects(allObjects, InventoryParser),
  ]);

  return {
    contractId: CONFIG.nftProtocolContractId,
    collectionId: collection?.id,
    mintCapId: mintCap?.id,
    feesIds: fees.length ? fees.map((_) => _.id) : undefined,
    launchpadIds: launchpads.length ? launchpads.map((_) => _.id) : undefined,
    launchpadSlotIds: launchpadSlots.length
      ? launchpadSlots.map((_) => _.id)
      : undefined,
    marketIds: markets.length ? markets.map((_) => _.id) : undefined,
    inventories: inventories.length ? inventories.map((_) => _.id) : undefined,
  };
};

const loadProgram = async () => {
  const start = Date.now();
  const addr = await signer.getAddress();
  console.log("Address:", addr);
  const publishTx = await loadAllTxs({
    MutatedObject: CONFIG.nftProtocolContractId,
  });
  const publishObjectIds = publishTx
    .map((_) => _.effects.created || [])
    .flat()
    .map((_) => _.reference.objectId);
  const objectsCache = await provider.getObjectBatch(publishObjectIds);
  objectsCache.push();
  let cursor: string | null = null;
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const txIds = await provider.getTransactions(
      { InputObject: CONFIG.nftProtocolContractId },
      cursor,
      100,
      "ascending"
    );
    // eslint-disable-next-line no-await-in-loop
    const txObjects = await provider.getTransactionWithEffectsBatch(txIds.data);
    // eslint-disable-next-line no-await-in-loop
    const objectsForTx = await provider.getObjectBatch(
      txObjects
        .flatMap((_) => _.effects.created || [])
        .map((_) => _.reference.objectId)
    );
    objectsCache.push(...objectsForTx);
    // eslint-disable-next-line no-await-in-loop
    const result = await resolveFields(objectsCache);

    const hasMultipleAddresses = Object.values(result).some(
      (_) => Array.isArray(_) && _.length > 1
    );

    if (hasMultipleAddresses) {
      throw new Error(`Multiple addresses found: ${JSON.stringify(result)}`);
    }
    const resultHasUndefined = Object.values(result).some(
      (_) => _ === undefined
    );
    if (!resultHasUndefined || txIds.nextCursor === null) {
      return result;
    }
    console.log("NExt", txIds.nextCursor);
    cursor = txIds.nextCursor;
  }
};

const createFees = async (): Promise<string | undefined> => {
  const transaction = NftClient.buildCreateFlatFee({
    packageObjectId: CONFIG.nftProtocolContractId,
    rate: CONFIG.feesRate,
  });
  const createFeeResult = await signer.executeMoveCall(transaction);
  if ("EffectsCert" in createFeeResult && createFeeResult.EffectsCert) {
    const createdObjects =
      createFeeResult.EffectsCert.effects.effects.created?.map(
        (_) => _.reference.objectId
      );
    const feeId = await client.fetchAndParseObjectsById(
      createdObjects || [],
      FlatFeeParser
    );
    return feeId[0].id;
  }
  return undefined;
};

const initLaunchpad = async (defaultFeeId: string) => {
  const transaction = NftClient.buildInitLaunchpad({
    packageObjectId: CONFIG.nftProtocolContractId,
    admin: CONFIG.launchpadAdmin, // launchpad admin,
    receiver: CONFIG.launchpadReceiver, // launchpad receiver
    defaultFee: defaultFeeId,
    autoApprove: true,
  });
  const initLaunchpadResult = await signer.executeMoveCall(transaction);
  if ("EffectsCert" in initLaunchpadResult && initLaunchpadResult.EffectsCert) {
    const createdObjects =
      initLaunchpadResult.EffectsCert.effects.effects.created?.map(
        (_) => _.reference.objectId
      );
    const launchpads = await client.fetchAndParseObjectsById(
      createdObjects || [],
      MarketplaceParser
    );
    return launchpads[0].id;
  }
  return undefined;
};

const initLaunchpadSlot = async (launchpadId: string) => {
  const transaction = NftClient.buildInitListing({
    packageObjectId: CONFIG.nftProtocolContractId,
    listingAdmin: CONFIG.lpSlotAdmin, // Slot admin,
    receiver: CONFIG.lpSlotReceiver, // Slot receiver
    launchpad: launchpadId,
  });
  const initSlotResult = await signer.executeMoveCall(transaction);
  if ("EffectsCert" in initSlotResult && initSlotResult.EffectsCert) {
    const createdObjects =
      initSlotResult.EffectsCert.effects.effects.created?.map(
        (_) => _.reference.objectId
      );
    const slots = await client.fetchAndParseObjectsById(
      createdObjects || [],
      ListingParser
    );
    return slots[0].id;
  }
  return undefined;
};

export const createInventory = async () => {
  const transaction = NftClient.buildCreateInventoryTx({
    packageObjectId: CONFIG.nftProtocolContractId,
    isWhitelisted: false,
  });
  const createInventoryResult = await signer.executeMoveCall(transaction);
  if (
    "EffectsCert" in createInventoryResult &&
    createInventoryResult.EffectsCert
  ) {
    const createdObjects =
      createInventoryResult.EffectsCert.effects.effects.created?.map(
        (_) => _.reference.objectId
      );
    const inventories = await client.fetchAndParseObjectsById(
      createdObjects || [],
      InventoryParser
    );
    return inventories[0].id;
  }
  return undefined;
};

const createMarket = async (slotId: string, inventoryId: string) => {
  const transaction = NftClient.buildCreateFixedPriceMarketWithInventory({
    packageObjectId: CONFIG.nftProtocolContractId,
    slot: slotId,
    inventoryId,
    price: 100,
  });
  const createMarketResult = await signer.executeMoveCall(transaction);
  if ("EffectsCert" in createMarketResult && createMarketResult.EffectsCert) {
    const createdObjects =
      createMarketResult.EffectsCert.effects.effects.created?.map(
        (_) => _.reference.objectId
      );
    console.log("Created objects", createdObjects);
    const markets = await client.fetchAndParseObjectsById(
      createdObjects || [],
      FixedPriceMarketParser
    );
    return markets[0].id;
  }
  return undefined;
};

const doFullCycle = async () => {
  const loadedContract = await loadProgram();

  console.log("loadedContract", loadedContract);
  if (!loadedContract.feesIds || !loadedContract.feesIds.length) {
    const feeId = await createFees();
    if (!feeId) {
      throw new Error("Fee not created");
    }
    loadedContract.feesIds = [feeId];
  }

  if (!loadedContract.launchpadIds || !loadedContract.launchpadIds.length) {
    const launchpadId = await initLaunchpad(loadedContract.feesIds[0]);
    if (!launchpadId) {
      throw new Error("Launchpad not created");
    }
    loadedContract.launchpadIds = [launchpadId];
  }

  if (
    !loadedContract.launchpadSlotIds ||
    !loadedContract.launchpadSlotIds.length
  ) {
    const slotId = await initLaunchpadSlot(loadedContract.launchpadIds[0]);
    if (!slotId) {
      throw new Error("Slot not created");
    }
    loadedContract.launchpadSlotIds = [slotId];
  }

  if (!loadedContract.inventories || !loadedContract.inventories.length) {
    const inventoryId = await createInventory();
    if (!inventoryId) {
      throw new Error("Inventory not created");
    }
    loadedContract.inventories = [inventoryId];
  }

  if (CONFIG.mintTestNFTs) {
    for (let i = 0; i < 100; i += 1) {
      const tx = NftClient.buildMintNft({
        name: `Test NFT ${i}`,
        description: `Test NFT ${i} Description `,
        mintCap: loadedContract.mintCapId,
        packageObjectId: CONFIG.nftContractId,
        inventoryId: loadedContract.inventories[0],
        moduleName: CONFIG.moduleName,
        url: "https://images.ctfassets.net/6kz06gcm2189/27OknKy2oUNvX8rGm1fHXH/1c5dd162685656aae5cbd3a54c27102c/how-to-mint-an-nft.png",
        attributes: {
          rarity: "Common",
          type: "NFT",
        },
      });
      // eslint-disable-next-line no-await-in-loop
      const mintResult = await signer.executeMoveCall(tx);
      if (
        "EffectsCert" in mintResult &&
        mintResult.EffectsCert.effects.effects.created
      ) {
        console.log(
          "Minted NFT:",
          mintResult.EffectsCert.effects.effects.created[0].reference.objectId
        );
      }
    }
  }

  if (!loadedContract.marketIds || !loadedContract.marketIds.length) {
    const marketId = await createMarket(
      loadedContract.launchpadSlotIds[0],
      loadedContract.inventories[0]
    );
    if (!marketId) {
      throw new Error("Market not created");
    }
    loadedContract.marketIds = [marketId];
  }

  return loadedContract;
};

doFullCycle().then((result) => console.log("Done", JSON.stringify(result)));
