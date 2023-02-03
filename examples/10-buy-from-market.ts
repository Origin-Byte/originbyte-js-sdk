import { NftClient } from "../src";
import {
  LISTING_ID, PACKAGE_OBJECT_ID,
  signer,
  VENUE_ID
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
    coin: "0x1233a48db4ff3ddeb4743e32af2c582e48e8c6ca",
    listing: LISTING_ID,
    venue: VENUE_ID,
  });
  const buyResult = await signer.executeMoveCall(buyCertificateTransaction);
  console.log("buyResult", JSON.stringify(buyResult));
};

buyFromLaunchpad();
