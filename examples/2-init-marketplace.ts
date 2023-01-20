import { NftClient } from "../src";
import { FEE_OBJECT_ID, PACKAGE_OBJECT_ID, signer } from "./common";

export const initMarketplace = async () => {
  const pubKey = await signer.getAddress();
  const transaction = NftClient.buildInitMarketplace({
    packageObjectId: PACKAGE_OBJECT_ID,
    admin: `0x${pubKey}`, // launchpad admin,
    receiver: `0x${pubKey}`, // launchpad receiver
    defaultFee: FEE_OBJECT_ID,
  });
  const initMarketplaceResult = await signer.executeMoveCall(transaction);
  console.log("initMarketplaceResult", JSON.stringify(initMarketplaceResult));
};

initMarketplace();
