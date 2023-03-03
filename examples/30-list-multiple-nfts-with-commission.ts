import { SUI_TYPE_ARG } from "@mysten/sui.js";
import {
  getSafeAndOwnerCap,
  orderbookClient,
  COLLECTION_ID_NAME,
  ORDERBOOK_ID,
  feeCollectorAddress,
  fetchNfts,
} from "./common";

export const listMultipleNftsWithCommission = async () => {
  const { safe, ownerCap } = await getSafeAndOwnerCap();
  const allNfts = await fetchNfts();

  if (allNfts.length === 0) {
    console.log("No NFTs for placing ask");
    return;
  }

  const nft = allNfts[0];

  const listNftResult = await orderbookClient.listMultipleNftsWithCommission({
    beneficiary: feeCollectorAddress,
    commissions: [1],
    sellerSafe: safe,
    ownerCap,
    nfts: [nft],
    collection: COLLECTION_ID_NAME,
    ft: SUI_TYPE_ARG,
    orderbook: ORDERBOOK_ID,
    prices: [11],
  });

  console.log("listNftResult: ", listNftResult);
};

listMultipleNftsWithCommission();
