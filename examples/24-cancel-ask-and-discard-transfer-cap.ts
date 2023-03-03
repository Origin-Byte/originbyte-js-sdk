import { SUI_TYPE_ARG } from "@mysten/sui.js";
import {
  ORDERBOOK_ID,
  orderbookClient,
  COLLECTION_ID_NAME,
  user,
  safeClient,
} from "./common";

export const cancelAskAndDiscardTransferCap = async () => {
  const ownerCaps = await safeClient.fetchOwnerCapsIds(user);
  const safeIdsByOwnerCap = await Promise.all(
    ownerCaps.map(async (ownerCap) => safeClient.fetchOwnerCapSafeId(ownerCap))
  );

  const safe = safeIdsByOwnerCap[0];
  const safeState = await safeClient.fetchSafe(safe);

  const listedNfts = safeState.nfts.filter(
    (el) => !!el.isExclusivelyListed && el.transferCapsCount > 0
  );

  const nft = listedNfts[0]?.id;
  const sellerSafe = safe;

  const orderbookState = await orderbookClient.fetchOrderbook(ORDERBOOK_ID);
  const ask = orderbookState.asks.find((el) => el.transferCap.nft === nft);

  if (!ask) {
    console.log("Such NFT is not listed in provided orderbook");
    return;
  }

  const result = await orderbookClient.cancelAskAndDiscardTransferCap({
    collection: COLLECTION_ID_NAME,
    ft: SUI_TYPE_ARG,
    nft,
    orderbook: ORDERBOOK_ID,
    price: ask.price,
    sellerSafe,
  });

  console.log("result: ", result);
};

cancelAskAndDiscardTransferCap();
