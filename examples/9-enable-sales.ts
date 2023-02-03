import { NftClient } from "../src";
import {
  INVENTORY_ID,
  LISTING_ID,
  MARKET_ID,
  PACKAGE_OBJECT_ID,
  signer,
} from "./common";

const enableSales = async () => {
  const mintNftTransaction = NftClient.buildEnableSales({
    packageObjectId: PACKAGE_OBJECT_ID,
    listing: LISTING_ID,
    inventory: INVENTORY_ID,
    market: MARKET_ID,
  });

  const enableSalesResult = await signer.executeMoveCall(mintNftTransaction);
  console.log("enableSalesResult", JSON.stringify(enableSalesResult));
};

enableSales();
