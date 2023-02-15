import { NftClient } from "../src";
import { WAREHOUSE_ID, LISTING_ID, PACKAGE_OBJECT_ID, signer, INVENTORY_ID } from "./common";

export const createMarket = async () => {
  const transaction = NftClient.buildInitVenue({
    packageObjectId: PACKAGE_OBJECT_ID,
    inventory: INVENTORY_ID,
    listing: LISTING_ID,
    price: 100000,
    isWhitelisted: false,
    nftClassName: "SUIMARINES",
    nftModuleName: "suimarines",
  });
  const createMarketResult = await signer.executeMoveCall(transaction);
  console.log("createMarketResult", JSON.stringify(createMarketResult));
};

createMarket();
