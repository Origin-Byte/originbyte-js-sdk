import { SUI_TYPE_ARG } from "@mysten/sui.js";
import {
  ORDERBOOK_ID,
  orderbookClient,
  COLLECTION_ID_NAME,
  fetchNfts,
  safeClient,
  getSafeAndOwnerCap,
} from "./common";

export const placeAsk = async () => {
  const allNfts = await fetchNfts();

  if (allNfts.length === 0) {
    console.log("No NFTs for placing ask");
    return;
  }

  console.log("allNfts: ", allNfts, "allNfts.length: ", allNfts.length);

  const nft = allNfts[0];
  const { ownerCap, safe } = await getSafeAndOwnerCap();

  await safeClient.depositNft({
    safe,
    nft,
    collection: COLLECTION_ID_NAME,
  });

  const { transferCap } = await safeClient.createExclusiveTransferCapForSender({
    safe,
    nft,
    ownerCap,
  });

  const createAskResult = await orderbookClient.createAsk({
    sellerSafe: safe,
    collection: COLLECTION_ID_NAME,
    ft: SUI_TYPE_ARG,
    orderbook: ORDERBOOK_ID,
    transferCap,
    price: 11,
  });

  const orderbookState = await orderbookClient.fetchOrderbook(ORDERBOOK_ID);

  console.log("orderbookState: ", orderbookState);
  console.log("createAskResult: ", createAskResult);
};

placeAsk();
