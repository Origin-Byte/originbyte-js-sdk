import { SUI_TYPE_ARG } from "@mysten/sui.js";
import {
  ORDERBOOK_ID,
  orderbookClient,
  COLLECTION_ID_NAME,
  getSafeAndOwnerCap,
  getGas,
  ALLOW_LIST_ID,
} from "./common";

export const buyNFT = async () => {
  const { ownerCap, safe } = await getSafeAndOwnerCap();
  const orderbookStateInitial = await orderbookClient.fetchOrderbook(
    ORDERBOOK_ID
  );
  console.log("orderbookStateInitial: ", orderbookStateInitial);

  if (orderbookStateInitial.asks.length === 0) {
    console.log("No asks to buy in the orderbook");

    return;
  }

  const ask = orderbookStateInitial.asks[0];

  if (!ask) {
    console.log("No such NFT listed on provided orderbook");
    return;
  }

  const { nft } = ask.transferCap;
  const sellerSafe = ask.transferCap.safe;
  const askPrice = ask.price;

  const buyNFtResult = await orderbookClient.buyNft({
    allowlist: ALLOW_LIST_ID,
    buyerSafe: safe,
    collection: COLLECTION_ID_NAME,
    ft: SUI_TYPE_ARG,
    nft,
    orderbook: ORDERBOOK_ID,
    price: askPrice,
    sellerSafe,
    wallet: await getGas(),
  });

  console.log("buyNFtResult: ", buyNFtResult);
};

buyNFT();
