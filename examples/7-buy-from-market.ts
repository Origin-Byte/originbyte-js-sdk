import { NftClient } from "../src";
import {
  LAUNCHPAD_SLOT_ID,
  MARKET_ID,
  PACKAGE_OBJECT_ID,
  signer,
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
    nftType: "suimarines",
    coin: "0xb5efaa9f3cf903a76ca01de4e6591c3814936f9d",
    slotId: LAUNCHPAD_SLOT_ID,
    marketId: MARKET_ID,
  });
  const buyResult = await signer.executeMoveCall(buyCertificateTransaction);
  console.log("buyResult", JSON.stringify(buyResult));
};

buyFromLaunchpad();
