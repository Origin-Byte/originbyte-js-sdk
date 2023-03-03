import { SUI_TYPE_ARG } from "@mysten/sui.js";
import {
  ORDERBOOK_ID,
  orderbookClient,
  getGas,
  COLLECTION_ID_NAME,
  user,
} from "./common";

export const cancelBid = async () => {
  const orderbookState = await orderbookClient.fetchOrderbook(ORDERBOOK_ID);

  const ownerBids = orderbookState.bids.filter(
    (el) => el.owner === `0x${user}`
  );

  if (!ownerBids.length) {
    console.log("No bids to cancel for current user");
    return;
  }

  const bidToCancel = ownerBids[0].offer;

  const result = await orderbookClient.cancelBid({
    collection: COLLECTION_ID_NAME,
    ft: SUI_TYPE_ARG,
    orderbook: ORDERBOOK_ID,
    price: bidToCancel,
    wallet: await getGas(),
  });

  console.log("placeBid: ", JSON.stringify(result));
};

cancelBid();
