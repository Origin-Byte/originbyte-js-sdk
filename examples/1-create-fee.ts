import { NftClient } from "../src";
import { PACKAGE_OBJECT_ID, signer } from "./common";

export const createFee = async () => {
  const transaction = NftClient.buildCreateFlatFee({
    packageObjectId: PACKAGE_OBJECT_ID,
    rate: 1000,
  });
  const createFeeResult = await signer.executeMoveCall(transaction);
  console.log("createFeeResult", JSON.stringify(createFeeResult));
};

createFee();
