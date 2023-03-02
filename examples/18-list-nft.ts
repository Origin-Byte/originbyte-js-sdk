import { SUI_TYPE_ARG } from "@mysten/sui.js";
import {
  ORDERBOOK_ID,
  orderbookClient,
  COLLECTION_ID_NAME,
  getSafeAndOwnerCap,
  safeClient,
} from "./common";

export const listNft = async () => {
  const { safe, ownerCap } = await getSafeAndOwnerCap();
  const safeState = await safeClient.fetchSafe(safe);

  const nftThatNotListedByExistsInSafe = safeState.nfts.filter(
    (el) => !el.isExclusivelyListed && el.transferCapsCount === 0
  );

  if (nftThatNotListedByExistsInSafe.length === 0) {
    console.log("No NFTs that available for listing");
    return;
  }

  const nft = nftThatNotListedByExistsInSafe[0].id;

  const listNftResult = await orderbookClient.listNft({
    sellerSafe: safe,
    ownerCap,
    nft,
    collection: COLLECTION_ID_NAME,
    ft: SUI_TYPE_ARG,
    orderbook: ORDERBOOK_ID,
    price: 11,
  });

  console.log("listNftResult: ", listNftResult);
};

listNft();
