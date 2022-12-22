import { NftClient } from '../src';
import { PACKAGE_OBJECT_ID, signer } from './common';

export const createInventory = async () => {
  const transaction = NftClient.buildCreateInventoryTx({
    packageObjectId: PACKAGE_OBJECT_ID,
    isWhitelisted: false,
  });
  const createInventoryResult = await signer.executeMoveCall(transaction);
  console.log('createInventoryResult', JSON.stringify(createInventoryResult));
};

createInventory();
