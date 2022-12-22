import { GetObjectDataResponse, SuiTransactionResponse, TransactionQuery } from '@mysten/sui.js';
import {
  CollectionParser, FixedPriceMarketParser, FlatFeeParser, InventoryParser, LaunchpadParser, LaunchpadSlotParser, MintCapParser,
} from '../src';
import {
  client, PACKAGE_OBJECT_ID, provider, signer,
} from './common';

const loadAllTxs = async (query: TransactionQuery) => {
  let result: SuiTransactionResponse[] = [];
  let cursor: string | null = null;
  while (true) {
    console.log('start search...');
    // eslint-disable-next-line no-await-in-loop
    const txIds = await provider.getTransactions(query, cursor, null, 'descending');
    // eslint-disable-next-line no-await-in-loop
    const txs = await provider.getTransactionWithEffectsBatch(txIds.data);
    result = [...result, ...txs];
    if (!txIds.nextCursor) {
      return result.sort((a, b) => b.timestamp_ms - a.timestamp_ms);
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
    client.parseObjects(allObjects, LaunchpadParser),
    client.parseObjects(allObjects, LaunchpadSlotParser),
    client.parseObjects(allObjects, FlatFeeParser),
    client.parseObjects(allObjects, MintCapParser),
    client.parseObjects(allObjects, FixedPriceMarketParser),
    client.parseObjects(allObjects, InventoryParser),
  ]);

  return {
    contractId: PACKAGE_OBJECT_ID,
    collectionId: collection?.id,
    mintCapId: mintCap?.id,
    feesIds: fees.length ? fees.map((_) => _.id) : undefined,
    launchpadIds: launchpads.length ? launchpads.map((_) => _.id) : undefined,
    launchpadSlotIds: launchpadSlots.length ? launchpadSlots.map((_) => _.id) : undefined,
    marketIds: markets.length ? markets.map((_) => _.id) : undefined,
    inventories: inventories.length ? inventories.map((_) => _.id) : undefined,
  };
};

const loadV2 = async () => {
  const start = Date.now();
  const publishTx = await loadAllTxs({ MutatedObject: PACKAGE_OBJECT_ID });
  const publishObjectIds = publishTx.map((_) => _.effects.created || []).flat().map((_) => _.reference.objectId);
  const objectsCache = await provider.getObjectBatch(publishObjectIds);
  objectsCache.push();
  let cursor: string | null = null;
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const txIds = await provider.getTransactions({ InputObject: PACKAGE_OBJECT_ID }, cursor, 100, 'ascending');
    console.log('txIds', txIds.data.length, txIds.nextCursor);
    // eslint-disable-next-line no-await-in-loop
    const txObjects = await provider.getTransactionWithEffectsBatch(txIds.data);
    // eslint-disable-next-line no-await-in-loop
    const objectsForTx = await provider.getObjectBatch(txObjects.flatMap((_) => _.effects.created || []).map((_) => _.reference.objectId));
    objectsCache.push(...objectsForTx);
    // eslint-disable-next-line no-await-in-loop
    const result = await resolveFields(objectsCache);

    const resultHasUndefined = Object.values(result).some((_) => _ === undefined);
    console.log('Found: ', result, Date.now() - start);
    if (!resultHasUndefined || txIds.nextCursor === null) {
      console.log('result', Date.now() - start, result);
      return;
    }
    cursor = txIds.nextCursor;
  }
};

const parseProgram = async () => {
  const start = Date.now();
  const [txs, publishTxs] = await Promise.all([
    await loadAllTxs({ InputObject: PACKAGE_OBJECT_ID }),
    await loadAllTxs({ MutatedObject: PACKAGE_OBJECT_ID }),
  ]);

  const allTxs = [...txs, ...publishTxs];
  const allCreatedObjects = allTxs.map((_) => _.effects.created || []).flat().map((_) => _.reference.objectId);
  // const chunks = splitBy(allCreatedObjects, 300);
  // const allObjects = await Promise.all(chunks.map((_) => provider.getObjectBatch(_)));

  const allObjects = await provider.getObjectBatch(allCreatedObjects);
  console.log('Objects found: ', allObjects.length, allTxs.length, Date.now() - start);

  const [
    [collection],
    launchpads,
    launchpadSlots,
    fees,
    [mintCap],
    markets,
  ] = await Promise.all([
    client.parseObjects(allObjects, CollectionParser),
    client.parseObjects(allObjects, LaunchpadParser),
    client.parseObjects(allObjects, LaunchpadSlotParser),
    client.parseObjects(allObjects, FlatFeeParser),
    client.parseObjects(allObjects, MintCapParser),
    client.parseObjects(allObjects, FixedPriceMarketParser),
  ]);

  const result = {
    packageId: PACKAGE_OBJECT_ID,
    collectionId: collection?.id,
    mintCapId: mintCap?.id,
    feesIds: fees.map((_) => _.id),
    launchpadIds: launchpads.map((_) => _.id),
    launchpadSlotIds: launchpadSlots.map((_) => _.id),
    marketIds: markets.map((_) => _.id),
  };

  console.log('result', result, Date.now() - start);
};

loadV2();
