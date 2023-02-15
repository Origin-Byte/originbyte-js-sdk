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
    coin: "0x00e2c8d1b8d37e74d926bdf305130eebd14f2ec8",
    listing: LISTING_ID,
    venue: VENUE_ID,
  });
  const buyResult = await signer.executeMoveCall(buyCertificateTransaction);
  console.log("buyResult", JSON.stringify(buyResult));
};

buyFromLaunchpad();
