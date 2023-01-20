import { NftClient } from "../src";
import { LISTING_ID, PACKAGE_OBJECT_ID, signer } from "./common";

export const initInventory = async () => {
  const transaction = NftClient.buildInitInventory({
    packageObjectId: PACKAGE_OBJECT_ID,
  });
  const initInventoryResult = await signer.executeMoveCall(transaction);
  console.log("initInventoryResult", JSON.stringify(initInventoryResult));
};

initInventory();
