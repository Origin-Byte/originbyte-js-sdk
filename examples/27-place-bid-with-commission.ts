import { SUI_TYPE_ARG } from "@mysten/sui.js";
import {
  ORDERBOOK_ID,
  orderbookClient,
  getGas,
  getSafeAndOwnerCap,
  COLLECTION_ID_NAME,
  feeCollectorAddress,
} from "./common";

export const placeBidWithCommission = async () => {
  const { safe } = await getSafeAndOwnerCap();

  const result = await orderbookClient.createBidWithCommission({
    buyerSafe: safe,
    collection: COLLECTION_ID_NAME,
    ft: SUI_TYPE_ARG,
    orderbook: ORDERBOOK_ID,
    price: 1200000,
    wallet: await getGas(),
    beneficiary: feeCollectorAddress,
    commission: 1,
  });

  console.log("placeBid: ", JSON.stringify(result));
};

placeBidWithCommission();
