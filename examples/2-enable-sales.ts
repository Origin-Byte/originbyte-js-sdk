import { NftClient } from "../src";
import { client, LAUNCHPAD_ID, signer } from "./common";

const enableSales = async () => {
  const markets = await client.getMarketsByParams({
    objectIds: [LAUNCHPAD_ID],
  });
  if (markets[0]) {
    const market = markets[0];
    if (market.data.live) {
      throw new Error("Market is already live");
    }
    console.log("Market:", market);
    const mintNftTransaction = NftClient.buildEnableSales({
      packageObjectId: market.data.packageObjectId,
      launchpadId: market.data.id,
      collectionType: `${market.data.packageObjectId}::${market.data.packageModule}::${market.data.packageModuleClassName}`,
    });
    const enableSalesResult = await signer.executeMoveCall(mintNftTransaction);
    console.log("enableSalesResult", enableSalesResult);
  }
};

enableSales();
