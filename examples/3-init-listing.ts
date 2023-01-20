import { NftClient } from "../src";
import { PACKAGE_OBJECT_ID, signer } from "./common";

export const initListing = async () => {
  const pubKey = await signer.getAddress();
  const transaction = NftClient.buildInitListing({
    packageObjectId: PACKAGE_OBJECT_ID,
    listingAdmin: `0x${pubKey}`, // launchpad admin,
    receiver: `0x${pubKey}`, // launchpad receiver
  });
  const initListingResult = await signer.executeMoveCall(transaction);
  console.log(
    "initListingResult",
    JSON.stringify(initListingResult)
  );
};

initListing();
