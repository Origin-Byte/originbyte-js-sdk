import { NftClient } from "../src";
import { LISTING_ID, PACKAGE_OBJECT_ID, signer } from "./common";

export const initInventory = async () => {
  const transaction = NftClient.buildInitWarehouse({
    packageObjectId: PACKAGE_OBJECT_ID,
  });
  const initWarehouseResult = await signer.executeMoveCall(transaction);
  console.log("initWarehouseResult", JSON.stringify(initWarehouseResult));
};

initInventory();
