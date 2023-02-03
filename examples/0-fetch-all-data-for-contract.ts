import { GetObjectDataResponse, TransactionDigest } from "@mysten/sui.js";

import {
  CollectionParser,
  MarketplaceParser,
  ListingParser,
  FixedPriceMarketParser,
  MintCapParser,
  FlatFeeParser,
  InventoryParser,
} from "../src";

import {
  client as ORIGINBYTE_CLIENT,
  provider as SUI_PROVIDER,
} from "./common";

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
    ORIGINBYTE_CLIENT.parseObjects(allObjects, CollectionParser),
    ORIGINBYTE_CLIENT.parseObjects(allObjects, MarketplaceParser),
    ORIGINBYTE_CLIENT.parseObjects(allObjects, ListingParser),
    ORIGINBYTE_CLIENT.parseObjects(allObjects, FlatFeeParser),
    ORIGINBYTE_CLIENT.parseObjects(allObjects, MintCapParser),
    ORIGINBYTE_CLIENT.parseObjects(allObjects, FixedPriceMarketParser),
    ORIGINBYTE_CLIENT.parseObjects(allObjects, InventoryParser),
  ]);

  return {
    collectionId: collection?.id,
    mintCapId: mintCap?.id,
    feesIds: fees.length ? fees.map((_) => _.id) : undefined,
    marketplaceIds: launchpads.length ? launchpads.map((_) => _.id) : undefined,
    listingIds: launchpadSlots.length
      ? launchpadSlots.map((_) => _.id)
      : undefined,
    marketIds: markets.length ? markets.map((_) => _.id) : undefined,
    inventoryIds: inventories.length ? inventories.map((_) => _.id) : undefined,
  };
};

export const resolveCollectionByPackage = async (packageId: string) => {
  const publishTxIds = await SUI_PROVIDER.getTransactions(
    { MutatedObject: packageId },
    null,
    1,
    "ascending"
  );

  const publishTx = await SUI_PROVIDER.getTransactionWithEffectsBatch(
    publishTxIds.data
  );
  const publishObjectIds = publishTx
    .map((_) => _.effects.created || [])
    .flat()
    .map((_) => _.reference.objectId);

  const objectsCache = await SUI_PROVIDER.getObjectBatch(publishObjectIds);
  let cursor: TransactionDigest | null | undefined;
  while (cursor !== "") {
    // eslint-disable-next-line no-await-in-loop
    const { data, nextCursor } = await SUI_PROVIDER.getTransactions({
      InputObject: packageId,
    });

    console.log("nextCursor", data, nextCursor, cursor);
    // eslint-disable-next-line no-await-in-loop
    const txObjects = await SUI_PROVIDER.getTransactionWithEffectsBatch(data);
    // eslint-disable-next-line no-await-in-loop
    const objectsForTx = await SUI_PROVIDER.getObjectBatch(
      txObjects
        .flatMap((_) => _.effects.created || [])
        .map((_) => _.reference.objectId)
    );
    objectsCache.push(...objectsForTx);
    // console.log("obj cache", objectsCache);
    // eslint-disable-next-line no-await-in-loop
    const result = await resolveFields(objectsCache);

    const resultHasUndefined = Object.values(result).some(
      (_) => _ === undefined
    );
    if (!resultHasUndefined || nextCursor === null) {
      console.log(
        "CollectionResolver",
        "Resolve result",
        JSON.stringify(result),
        nextCursor
      );
      return result;
    }
    cursor = nextCursor;
  }
  return {
    collectionId: undefined,
    mintCapId: undefined,
    feesIds: [],
    marketplaceIds: [],
    listingIds: [],
    marketIds: [],
    inventoryIds: [],
  };
};

resolveCollectionByPackage("0x2dff000aa10c6490fa589521f4b530ca0340fbcc");
