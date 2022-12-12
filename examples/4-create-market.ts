import { NftClient } from '../src';
import {
  LAUNCHPAD_ID, LAUNCHPAD_SLOT_ID, PACKAGE_OBJECT_ID, signer,
} from './common';

export const createMarket = async () => {
  const transaction = NftClient.buildCreateFixedPriceMarket({
    packageObjectId: PACKAGE_OBJECT_ID,
    launchpad: LAUNCHPAD_ID,
    slot: LAUNCHPAD_SLOT_ID,
    isWhitelisted: true,
    price: 100,
  });
  const createMarketResult = await signer.executeMoveCall(transaction);
  console.log('createMarketResult', JSON.stringify(createMarketResult));
};

createMarket();
