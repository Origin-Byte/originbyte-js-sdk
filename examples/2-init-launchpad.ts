import { NftClient } from "../src";
import { FEE_OBJECT_ID, PACKAGE_OBJECT_ID, signer } from "./common";

export const initLaunchpad = async () => {
  const pubKey = await signer.getAddress();
  const transaction = NftClient.buildInitLaunchpad({
    packageObjectId: PACKAGE_OBJECT_ID,
    admin: `0x${pubKey}`, // launchpad admin,
    receiver: `0x${pubKey}`, // launchpad receiver
    defaultFee: FEE_OBJECT_ID,
    autoApprove: true,
  });
  const initLaunchpadResult = await signer.executeMoveCall(transaction);
  console.log("initLaunchpadResult", JSON.stringify(initLaunchpadResult));
};

initLaunchpad();
