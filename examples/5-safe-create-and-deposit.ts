import { SafeClient } from "../src";
import { PACKAGE_OBJECT_ID, signer } from "./common";

const main = async () => {
  const tx = SafeClient.createSafeForSenderTx({
    packageObjectId: PACKAGE_OBJECT_ID,
  });
  console.log("Creating Safe object for sender ...");
  const res = await signer.executeMoveCallWithRequestType(tx);

  console.log("res", res);
};

main();
