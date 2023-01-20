import { NftClient } from "../src";
import {
  INVENTORY_ID,
  LISTING_ID,
  MARKET_ID,
  PACKAGE_OBJECT_ID,
  signer
} from "./common";

const buyFromLaunchpad = async () => {
  // const markets = await client.getMarketsByParams({ objectIds: [LAUNCHPAD_ID] });
  // if (markets[0]) {
  //   const market = markets[0];
  //   if (!market.data.live) {
  //     throw new Error('Market is not live yet');
  //   }
  //   if (!market.data.sales.find((s) => s.nfts.length > 0)) {
  //     throw new Error('Market has no sales');
  //   }

  const buyCertificateTransaction = NftClient.buildBuyNft({
    packageObjectId: PACKAGE_OBJECT_ID,
    nftModuleName: "suimarines",
    nftClassName: "SUIMARINES",
    coin: "0xdb9eddb2fdff7a727404e936e7254c386777d9f7",
    listing: LISTING_ID,
    inventory: INVENTORY_ID,
    market: MARKET_ID,
  });
  const buyResult = await signer.executeMoveCall(buyCertificateTransaction);
  console.log("buyResult", JSON.stringify(buyResult));
};

buyFromLaunchpad();
