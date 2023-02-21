import { NftClient } from "../src";
import { LISTING_ID, PACKAGE_OBJECT_ID, signer, VENUE_ID } from "./common";

const enableSales = async () => {
  const mintNftTransaction = NftClient.buildEnableSales({
    packageObjectId: PACKAGE_OBJECT_ID,
    listing: LISTING_ID,
    venue: VENUE_ID,
  });

  const enableSalesResult = await signer.executeMoveCall(mintNftTransaction);
  console.log("enableSalesResult", JSON.stringify(enableSalesResult));
};

enableSales();
