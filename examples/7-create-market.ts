import { NftClient } from "../src";
import { WAREHOUSE_ID, LISTING_ID, PACKAGE_OBJECT_ID, signer } from "./common";

export const createMarket = async () => {
  const transaction = NftClient.buildInitVenue({
    packageObjectId: PACKAGE_OBJECT_ID,
    inventory: WAREHOUSE_ID,
    listing: LISTING_ID,
    price: 100000,
    isWhitelisted: false,
  });
  const createMarketResult = await signer.executeMoveCall(transaction);
  console.log("createMarketResult", JSON.stringify(createMarketResult));
};

createMarket();
