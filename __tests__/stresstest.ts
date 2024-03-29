/**
 * Keeps trading NFTs between bunch of saves.
 *
 * ENV variables:
 * - RPC_ENDPOINT - RPC endpoint to use, defaults to "LOCAL"
 * - MNEMONIC - mnemonic to use, defaults to one with pubkey of 0xddcdd8e07b59852f58ba8db8daff1b585d2fca23
 * - TESTRACT_ADDRESS - address of testract package on the chain of RPC_ENDPOINT
 * - NFT_PROTOCOL_ADDRESS - address of testract package NFT dependency on the chain of RPC_ENDPOINT
 */

console.warn = () => {};
require("dotenv").config();

import {
  Connection,
  Ed25519Keypair,
  JsonRpcProvider,
  ObjectId,
} from "@mysten/sui.js";
import { SafeFullClient, OrderbookFullClient } from "../src";

// Initial setup
const SAVES_WITH_NFTS_COUNT = 5;
const NFTS_PER_SAFE = 5;
const SAVES_WITHOUT_NFTS_COUNT = 15;
// After each tick, in which we trade NFTs, we sleep for this amount of time
const SLEEP_AFTER_TICK_MS = 0;
const MAX_CONSEQUENT_ERRORS_COUNT = 3;
const SLEEP_AFTER_FIRST_ERROR_MS = 1000;
const DEFAULT_GAS_BUDGET = 100_000;
const TESTRACT_ADDRESS = process.env.TESTRACT_ADDRESS;
const TESTRACT_OTW_TYPE = `${TESTRACT_ADDRESS}::testract::TESTRACT`;
const TESTRACT_C_TYPE = TESTRACT_OTW_TYPE;
const NFT_PROTOCOL_ADDRESS = process.env.NFT_PROTOCOL_ADDRESS;
const ENV = process.env.RPC_ENDPOINT || "LOCAL";
const KEYPAIR = process.env.MNEMONIC
  ? Ed25519Keypair.deriveKeypair(process.env.MNEMONIC)
  : new Ed25519Keypair({
      publicKey: Uint8Array.from([
        123, 49, 136, 138, 93, 52, 142, 26, 32, 156, 52, 154, 223, 80, 191, 2,
        136, 183, 246, 194, 17, 192, 124, 120, 97, 137, 189, 25, 225, 196, 206,
        252,
      ]),
      secretKey: Uint8Array.from([
        247, 8, 180, 26, 178, 76, 142, 156, 80, 194, 241, 66, 143, 182, 235,
        102, 66, 242, 47, 157, 43, 116, 165, 212, 124, 189, 163, 59, 11, 212,
        187, 138, 123, 49, 136, 138, 93, 52, 142, 26, 32, 156, 52, 154, 223, 80,
        191, 2, 136, 183, 246, 194, 17, 192, 124, 120, 97, 137, 189, 25, 225,
        196, 206, 252,
      ]),
    });
console.log("Using keypair", KEYPAIR.getPublicKey().toSuiAddress());
const safeClient = SafeFullClient.fromKeypair(
  KEYPAIR,
  new JsonRpcProvider(new Connection({ fullnode: ENV })),
  {
    packageObjectId: NFT_PROTOCOL_ADDRESS,
  }
);
const orderbookClient = OrderbookFullClient.fromKeypair(
  KEYPAIR,
  safeClient.client.provider,
  {
    packageObjectId: NFT_PROTOCOL_ADDRESS,
  }
);

/**
 * Taken from https://www.npmjs.com/package/random
 *
 * https://en.wikipedia.org/wiki/Normal_distribution
 */
function normalDistribution(mu: number, sigma: number) {
  let x: number, y: number, r: number;
  do {
    x = Math.random() * 2 - 1;
    y = Math.random() * 2 - 1;
    r = x * x + y * y;
  } while (!r || r > 1);
  return mu + sigma * y * Math.sqrt((-2 * Math.log(r)) / r);
}

// Price distributions
const BID_DISTRIBUTION = () => Math.round(normalDistribution(510, 70));
const ASK_DISTRIBUTION = () => Math.round(normalDistribution(520, 50));

const tradeIntermediaries: string[] = [];

async function createSafeWithNfts() {
  const { safe, ownerCap } = await safeClient.createSafeForSender();
  if (ENV !== "LOCAL") {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  await safeClient.client.sendTxWaitForEffects({
    packageObjectId: TESTRACT_ADDRESS!,
    module: "testract",
    function: "mint_n_nfts",
    typeArguments: [],
    arguments: [String(NFTS_PER_SAFE), safe],
    gasBudget: DEFAULT_GAS_BUDGET * 4,
  });

  return { safe, ownerCap };
}

async function createAsk(
  nftToList: ObjectId,
  orderbook: ObjectId,
  safe: ObjectId,
  ownerCap: ObjectId
) {
  const { transferCap } = await safeClient.createExclusiveTransferCapForSender({
    safe,
    ownerCap,
    nft: nftToList,
  });

  const price = ASK_DISTRIBUTION();
  const { trade } = await orderbookClient.createAsk({
    collection: TESTRACT_C_TYPE,
    ft: TESTRACT_OTW_TYPE,
    orderbook,
    price,
    sellerSafe: safe,
    transferCap,
  });

  if (trade) {
    tradeIntermediaries.push(trade);
  }
}

async function createBid(
  treasury: ObjectId,
  orderbook: ObjectId,
  safe: ObjectId
) {
  const price = BID_DISTRIBUTION();
  const { created } = await orderbookClient.client.sendTxWaitForEffects({
    packageObjectId: TESTRACT_ADDRESS!,
    module: "testract",
    function: "create_bid",
    typeArguments: [],
    arguments: [String(price), safe, treasury, orderbook],
    gasBudget: DEFAULT_GAS_BUDGET,
  });

  const trade = created?.find(
    (obj) => typeof obj.owner === "object" && "Shared" in obj.owner
  );
  if (trade) {
    tradeIntermediaries.push(trade.reference.objectId);
  }
}

async function getGlobalObjects(): Promise<{
  treasury: ObjectId;
  allowlist: ObjectId;
}> {
  console.log("Getting treasury and allowlist...");

  const objs = await orderbookClient.client.getObjects(
    KEYPAIR.getPublicKey().toSuiAddress()
  );

  const treasury = objs.find(
    (obj) =>
      obj.type.includes("TreasuryCap") &&
      // https://github.com/MystenLabs/sui/issues/8017
      obj.type.includes(TESTRACT_ADDRESS!.replace("0x0", "0x"))
  )?.objectId;
  if (!treasury) {
    objs
      .filter((obj) => obj.type.includes("TreasuryCap"))
      .forEach((obj) => console.log(obj.type));
    throw new Error("Treasury not found");
  }

  const allowlists = objs
    .filter(
      (obj) =>
        // https://github.com/MystenLabs/sui/issues/8017
        obj.type ===
        `${NFT_PROTOCOL_ADDRESS!.replace(
          "0x0",
          "0x"
        )}::transfer_allowlist::Allowlist`
    )
    .map((o) => o.objectId);

  while (allowlists.length !== 0) {
    const allowlist = allowlists.pop()!;
    const { data } = (await orderbookClient.client.getObject(allowlist)) as any;
    const hasTestract = data.fields.collections.fields.contents.some(
      ({ fields }: any) => fields.name.startsWith(TESTRACT_ADDRESS?.slice(2))
    );
    if (hasTestract) {
      return { treasury, allowlist };
    }
  }

  throw new Error("Allowlist not found");
}

async function finishAllTrades(allowlist: ObjectId) {
  while (tradeIntermediaries.length !== 0) {
    const trade = tradeIntermediaries.pop()!;
    const { transferCap, buyerSafe } =
      await orderbookClient.fetchTradeIntermediary(trade);
    if (!transferCap) {
      throw new Error("Expected transfer cap to be present");
    }

    const { tradePayments } = await orderbookClient.finishTrade({
      trade,
      allowlist,
      collection: TESTRACT_C_TYPE,
      ft: TESTRACT_OTW_TYPE,
      buyerSafe,
      sellerSafe: transferCap.safe,
    });
    if (tradePayments.length !== 1) {
      throw new Error("Expected exactly one TradePayment object");
    }
    if (ENV !== "LOCAL") {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    await safeClient.client.sendTxWaitForEffects({
      packageObjectId: TESTRACT_ADDRESS!,
      module: "testract",
      function: "collect_royalty",
      typeArguments: [],
      arguments: [tradePayments[0]],
      gasBudget: DEFAULT_GAS_BUDGET,
    });
  }
}

async function tick(
  orderbook: ObjectId,
  treasury: ObjectId,
  allowlist: ObjectId,
  saves: Array<{ safe: ObjectId; ownerCap: ObjectId }>
) {
  const safeIndex = Math.floor(Math.random() * saves.length);
  const { safe, ownerCap } = saves[safeIndex];

  const { nfts } = await safeClient.fetchSafe(safe);
  const nftToList = nfts.find((nft) => nft.transferCapsCount === 0);

  // we don't want to execute a trade where both seller and buyer is the same
  // safe
  const { asks, bids } = await orderbookClient.fetchOrderbook(
    orderbook,
    true // sort
  );

  if (nftToList && !(bids.length > 0 && bids[0].safe === safe)) {
    await createAsk(nftToList.id, orderbook, safe, ownerCap);
  } else if (!(asks.length > 0 && asks[0].transferCap.safe === safe)) {
    await createBid(treasury, orderbook, safe);
  }

  if (SLEEP_AFTER_TICK_MS) {
    await new Promise((resolve) => setTimeout(resolve, SLEEP_AFTER_TICK_MS));
  }

  await finishAllTrades(allowlist);
}

async function start(
  orderbook: ObjectId,
  treasury: ObjectId,
  allowlist: ObjectId,
  saves: Array<{ safe: ObjectId; ownerCap: ObjectId }>
) {
  let consequentErrors = 0;
  while (true) {
    try {
      await tick(orderbook, treasury, allowlist, saves);

      consequentErrors = 0;
    } catch (error) {
      console.error(error);
      consequentErrors += 1;

      if (consequentErrors > MAX_CONSEQUENT_ERRORS_COUNT) {
        break;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, SLEEP_AFTER_FIRST_ERROR_MS * consequentErrors)
      );
    }
  }

  console.log();
  console.log();
  console.error("Terminated due to too many errors");
}

async function main() {
  const { treasury, allowlist } = await getGlobalObjects();

  const { orderbook } = await orderbookClient.createOrderbook({
    ft: TESTRACT_OTW_TYPE,
    collection: TESTRACT_C_TYPE,
  });

  const saves: Array<{ safe: ObjectId; ownerCap: ObjectId }> = [];
  console.log(`Creating ${SAVES_WITHOUT_NFTS_COUNT} empty safes...`);
  for (let i = 0; i < SAVES_WITHOUT_NFTS_COUNT; i++) {
    const { safe, ownerCap } = await safeClient.createSafeForSender();
    saves.push({ safe, ownerCap });
  }
  console.log(`Creating ${SAVES_WITH_NFTS_COUNT} safes with NFTs...`);
  for (let i = 0; i < SAVES_WITH_NFTS_COUNT; i++) {
    saves.push(await createSafeWithNfts());
  }

  console.log("Trading begins...");
  await start(orderbook, treasury, allowlist, saves);
}

main();
