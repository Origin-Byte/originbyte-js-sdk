import { SUI_TYPE_ARG } from "@mysten/sui.js";
import {
  ORDERBOOK_ID,
  orderbookClient,
  COLLECTION_ID_NAME,
  fetchNfts,
  NFT_TYPE,
  feeCollectorAddress,
} from "./common";

export const createSafeAndDepositAndListNftWithCommission = async () => {
  const allNfts = await fetchNfts();

  if (allNfts.length === 0) {
    console.log("No NFTs for placing ask");
    return;
  }

  console.log("allNfts: ", allNfts, "allNfts.length: ", allNfts.length);

  const nft = allNfts[0];

  const result =
    await orderbookClient.createSafeAndDepositAndListNftWithCommission({
      beneficiary: feeCollectorAddress,
      commission: 1,
      nft,
      nftType: NFT_TYPE,
      collection: COLLECTION_ID_NAME,
      ft: SUI_TYPE_ARG,
      orderbook: ORDERBOOK_ID,
      price: 11,
    });

  console.log("result: ", result);
};

createSafeAndDepositAndListNftWithCommission();
