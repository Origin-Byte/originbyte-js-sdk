import { NftClient } from "../src";
import { PACKAGE_OBJECT_ID, signer } from "./common";

export const initListing = async () => {
  const pubKey = await signer.getAddress();
  const [transactionBlock] = NftClient.buildInitListing({
    packageObjectId: PACKAGE_OBJECT_ID,
    listingAdmin: pubKey, // launchpad admin,
    receiver: pubKey, // launchpad receiver
  });
  const initListingResult = await signer.signAndExecuteTransactionBlock({
    transactionBlock,
    options: { showEffects: true, showObjectChanges: true },
  });
  console.log("initListingResult", JSON.stringify(initListingResult));
};

initListing();
