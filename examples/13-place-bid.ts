import { SUI_TYPE_ARG } from "@mysten/sui.js";
import {
  ORDERBOOK_ID,
  orderbookClient,
  getGas,
  getSafeAndOwnerCap,
  COLLECTION_ID_NAME,
} from "./common";

export const placeBid = async () => {
  const { safe } = await getSafeAndOwnerCap();

  const result = await orderbookClient.createBid({
    buyerSafe: safe,
    collection: COLLECTION_ID_NAME,
    ft: SUI_TYPE_ARG,
    orderbook: ORDERBOOK_ID,
    price: 1000000,
    wallet: await getGas(),
  });

  console.log("placeBid: ", JSON.stringify(result));
};

placeBid();
