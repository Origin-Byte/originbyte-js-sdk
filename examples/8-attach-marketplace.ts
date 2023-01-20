import { NftClient } from "../src";
import {
  INVENTORY_ID,
  LISTING_ID,
  MARKETPLACE_ID,
  PACKAGE_OBJECT_ID,
  signer,
} from "./common";

export const attachMarketplace = async () => {
  const transaction = NftClient.buildRequestToJoinMarketplace({
    packageObjectId: PACKAGE_OBJECT_ID,
    marketplace: MARKETPLACE_ID,
    listing: LISTING_ID,
  });
  const buildRequestResult = await signer.executeMoveCall(transaction);
  console.log("buildRequestResult", JSON.stringify(buildRequestResult));

  const transaction2 = NftClient.buildAcceptListingRequest({
    packageObjectId: PACKAGE_OBJECT_ID,
    marketplace: MARKETPLACE_ID,
    listing: LISTING_ID,
  });

  const acceptRequestResult = await signer.executeMoveCall(transaction2);
  console.log("acceptRequestResult", JSON.stringify(acceptRequestResult));
};

attachMarketplace();
