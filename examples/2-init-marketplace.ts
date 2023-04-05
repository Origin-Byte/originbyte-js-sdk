import { NftClient } from "../src";
import { FEE_OBJECT_ID, PACKAGE_OBJECT_ID, signer } from "./common";

export const initMarketplace = async () => {
  const pubKey = await signer.getAddress();
  const [transactionBlock] = NftClient.buildInitMarketplace({
    packageObjectId: PACKAGE_OBJECT_ID,
    admin: pubKey, // launchpad admin,
    receiver: pubKey, // launchpad receiver
    defaultFee: FEE_OBJECT_ID,
  });
  const initMarketplaceResult = await signer.signAndExecuteTransactionBlock({
    transactionBlock,
    options: { showEffects: true, showObjectChanges: true },
  });
  console.log("initMarketplaceResult", JSON.stringify(initMarketplaceResult));
};

initMarketplace();
