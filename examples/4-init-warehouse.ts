import { NftClient } from "../src";
import { PACKAGE_OBJECT_ID, signer, NFT_TYPE } from "./common";

export const initInventory = async () => {
  const [transactionBlock] = NftClient.buildInitWarehouse({
    packageObjectId: PACKAGE_OBJECT_ID,
    nftType: NFT_TYPE,
  });
  const initWarehouseResult = await signer.signAndExecuteTransactionBlock({
    transactionBlock,
    options: { showEffects: true, showObjectChanges: true },
  });
  console.log("initWarehouseResult", JSON.stringify(initWarehouseResult));
};

initInventory();
