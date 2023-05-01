import { SUI_TYPE_ARG, TransactionBlock } from "@mysten/sui.js";
import {
  ORDERBOOK_ID,
  COLLECTION_ID_NAME,
  signer,
  orderbookClient,
  getKiosks,
  ORDERBOOK_PACKAGE_ID,
} from "./common";
import { OrderbookFullClient } from "../src";

export const cancelAsk = async () => {
  const pubkeyAddress = await signer.getAddress();
  console.log("Address: ", pubkeyAddress);

  const kiosks = await getKiosks();
  if (kiosks.length === 0) {
    console.error("No kiosks found");
    return;
  }

  const kiosk = kiosks[0];
  const orderbook = await orderbookClient.fetchOrderbook(ORDERBOOK_ID, true);
  console.log("orderbook", orderbook);

  if (orderbook.asks.length === 0) {
    console.error("No asks found");
    return;
  }

  const askToCancel = orderbook.asks.find((ask) => ask.kiosk === kiosk.id.id);

  if (askToCancel === undefined) {
    console.error("No asks from user in the orderbook found");
    return;
  }

  let tx = new TransactionBlock();

  [tx] = OrderbookFullClient.cancelAskTx({
    packageObjectId: ORDERBOOK_PACKAGE_ID,
    sellersKiosk: kiosks[0].id.id,
    nft: askToCancel.nft,
    collection: COLLECTION_ID_NAME,
    ft: SUI_TYPE_ARG,
    orderbook: ORDERBOOK_ID,
    price: askToCancel.price,
  });

  tx.setGasBudget(100_000_000);
  const result = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: { showEffects: true },
  });

  console.log("result: ", result);
};

cancelAsk();
