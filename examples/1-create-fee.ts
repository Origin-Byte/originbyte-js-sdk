import { NftClient } from "../src";
import { PACKAGE_OBJECT_ID, signer } from "./common";

export const createFee = async () => {
  const [transactionBlock] = NftClient.buildCreateFlatFee({
    packageObjectId: PACKAGE_OBJECT_ID,
    rate: 10000000,
  });
  const createFeeResult = await signer.signAndExecuteTransactionBlock({
    transactionBlock,
    options: { showEffects: true, showObjectChanges: true },
  });
  console.log("createFeeResult", JSON.stringify(createFeeResult));
};

createFee();
