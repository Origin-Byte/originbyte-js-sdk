import { NftClient } from '../src';
import { LAUNCHPAD_SLOT_ID, PACKAGE_OBJECT_ID, signer } from './common';

export const createMarket = async () => {
  const transaction = NftClient.buildCreateFixedPriceMarket({
    packageObjectId: PACKAGE_OBJECT_ID,
    slot: LAUNCHPAD_SLOT_ID,
    isWhitelisted: false,
    price: 100,
    collectionType: `${PACKAGE_OBJECT_ID}::suimarines::SUIMARINES`,
  });
  const createMarketResult = await signer.executeMoveCall(transaction);
  console.log('createMarketResult', JSON.stringify(createMarketResult));
};

createMarket();
