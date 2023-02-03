import { NftClient } from "../src";
import { WAREHOUSE_ID, LISTING_ID, PACKAGE_OBJECT_ID, signer } from "./common";

export const addInventoryToListing = async () => {
  const transaction = NftClient.buildAddWarehouseToListing({
    packageObjectId: PACKAGE_OBJECT_ID,
    warehouse: WAREHOUSE_ID,
    listing: LISTING_ID,
  });
  const addInventoryResult = await signer.executeMoveCall(transaction);
  console.log("addInventoryResult", JSON.stringify(addInventoryResult));
};

addInventoryToListing();
