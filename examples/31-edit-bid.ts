import { SUI_TYPE_ARG } from "@mysten/sui.js";
import {
  ORDERBOOK_ID,
  orderbookClient,
  getGas,
  getSafeAndOwnerCap,
  COLLECTION_ID_NAME,
  user,
} from "./common";

export const editBid = async () => {
  const { safe } = await getSafeAndOwnerCap();
  const orderbookState = await orderbookClient.fetchOrderbook(ORDERBOOK_ID);

  const ownerBids = orderbookState.bids.filter(
    (el) => el.owner === `0x${user}`
  );

  if (!ownerBids.length) {
    console.log("No bids to cancel for current user");
    return;
  }

  const bidToEditPrice = ownerBids[0].offer;

  const result = await orderbookClient.editBid({
    buyerSafe: safe,
    collection: COLLECTION_ID_NAME,
    ft: SUI_TYPE_ARG,
    orderbook: ORDERBOOK_ID,
    oldPrice: bidToEditPrice,
    newPrice: 10,
    wallet: await getGas(),
  });

  console.log("placeBid: ", JSON.stringify(result));
};

editBid();
