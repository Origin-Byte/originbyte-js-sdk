import { SUI_TYPE_ARG } from "@mysten/sui.js";
import {
  ORDERBOOK_ID,
  orderbookClient,
  getGas,
  COLLECTION_ID_NAME,
  feeCollectorAddress,
} from "./common";

export const createSafeAndBidWithCommission = async () => {
  const result = await orderbookClient.createSafeAndBidWithCommission({
    beneficiary: feeCollectorAddress,
    commission: 1,
    collection: COLLECTION_ID_NAME,
    ft: SUI_TYPE_ARG,
    orderbook: ORDERBOOK_ID,
    price: 1,
    wallet: await getGas(),
  });

  console.log("placeBid: ", JSON.stringify(result));
};

createSafeAndBidWithCommission();
