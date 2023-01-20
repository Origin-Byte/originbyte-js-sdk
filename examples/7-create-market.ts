import { NftClient } from "../src";
import {
  INVENTORY_ID,
  LISTING_ID,
  PACKAGE_OBJECT_ID,
  signer,
} from "./common";

export const createMarket = async () => {
  const transaction = NftClient.buildCreateFixedPriceMarketOnListing({
    packageObjectId: PACKAGE_OBJECT_ID,
    inventory: INVENTORY_ID,
    listing: LISTING_ID,
    price: 1000,
    isWhitelisted: false,
  });
  const createMarketResult = await signer.executeMoveCall(transaction);
  console.log("createMarketResult", JSON.stringify(createMarketResult));
};

createMarket();
