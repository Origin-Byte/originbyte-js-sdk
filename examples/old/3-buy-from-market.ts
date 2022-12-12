import { NftClient } from '../src';
import {
  client, FEES_OBJECT_ID, LAUNCHPAD_ID, signer,
} from './common';

const buyFromLaunchpad = async () => {
  const markets = await client.getMarketsByParams({ objectIds: [LAUNCHPAD_ID] });
  if (markets[0]) {
    const market = markets[0];
    if (!market.data.live) {
      throw new Error('Market is not live yet');
    }
    if (!market.data.sales.find((s) => s.nfts.length > 0)) {
      throw new Error('Market has no sales');
    }

    const buyCertificateTransaction = NftClient.buildBuyNftCertificate({
      collectionType: `${market.data.packageObjectId}::${market.data.packageModule}::${market.data.packageModuleClassName}`,
      packageObjectId: market.data.packageObjectId,
      launchpadId: market.data.id,
      wallet: FEES_OBJECT_ID, // Coin address to pay for NFT
    });
    const buyResult = await signer.executeMoveCall(buyCertificateTransaction);
    console.log('buyResult', JSON.stringify(buyResult));
  }
};

buyFromLaunchpad();
