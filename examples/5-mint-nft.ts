import { NftClient } from '../src';
import {
  LAUNCHPAD_SLOT_ID, MARKET_ID, MINT_CAP_ID, PACKAGE_OBJECT_ID, signer,
} from './common';

export const mintNFt = async () => {
  const transaction = NftClient.biuldMintNft({
    name: 'Test NFT',
    description: 'Test NFT Description',
    mintCap: MINT_CAP_ID,
    slot: LAUNCHPAD_SLOT_ID,
    marketId: MARKET_ID,
    packageObjectId: PACKAGE_OBJECT_ID,
    moduleName: 'suimarines',
  });
  const createMarketResult = await signer.executeMoveCall(transaction);
  console.log('createMarketResult', JSON.stringify(createMarketResult));
};

mintNFt();
