import { SUI_TYPE_ARG } from "@mysten/sui.js";
import { COLLECTION_TYPE, orderbookClient } from "./common";

export const createOrderbookMarket = async () => {
  const { orderbook } = await orderbookClient.createOrderbook({
    collection: COLLECTION_TYPE,
    ft: SUI_TYPE_ARG,
  });

  console.log("Orderbook: ", JSON.stringify(orderbook));

  // Orderbook 0xf6d4e442cb228b9322b5c64c4e8fe0b1323af55d
  const state = await orderbookClient.fetchOrderbook(orderbook);

  console.log("State: ", JSON.stringify(state));
};

createOrderbookMarket();
