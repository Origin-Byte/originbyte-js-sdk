import { NftClient } from "../src";
import { client, LAUNCHPAD_ID, signer } from "./common";

const buyFromLaunchpad = async () => {
  const markets = await client.getMarketsByParams({
    objectIds: [LAUNCHPAD_ID],
  });
  if (markets[0]) {
    const market = markets[0];
    if (!market.data.live) {
      throw new Error("Market is not live yet");
    }
    if (!market.data.sales.find((s) => s.nfts.length > 0)) {
      throw new Error("Market has no sales");
    }

    const buyCertificateTransaction = NftClient.buildBuyNftCertificate({
      collectionType: `${market.data.packageObjectId}::${market.data.packageModule}::${market.data.packageModuleClassName}`,
      packageObjectId: market.data.packageObjectId,
      launchpadId: market.data.id,
      wallet: "0x352ca4f1b92d544df8d0598a9d58fc76eec10b4b", // Coin address to pay for NFT
    });
    const buyResult = await signer.executeMoveCall(buyCertificateTransaction);
    console.log("buyResult", buyResult);
  }
};

buyFromLaunchpad();
