import { SUI_TYPE_ARG, TransactionBlock } from "@mysten/sui.js";
import {
  ORDERBOOK_ID,
  orderbookClient,
  COLLECTION_ID_NAME,
  user,
  safeClient,
  signer,
  kioskClient,
} from "./common";
import { OrderbookFullClient } from "../src";

export const editAsk = async () => {
  const pubkeyAddress = await signer.getAddress();
  console.log("Address: ", pubkeyAddress);

  const kiosks = await kioskClient.getWalletKiosks(pubkeyAddress);
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

  const askToEdit = orderbook.asks.find((ask) => ask.kiosk === kiosk.id.id);

  if (askToEdit === undefined) {
    console.error("No asks from user in the orderbook found");
    return;
  }

  let tx = new TransactionBlock();

  const { nft, kiosk: sellersKiosk, price } = askToEdit;

  [tx] = OrderbookFullClient.editAskTx({
    sellersKiosk,
    collection: COLLECTION_ID_NAME,
    ft: SUI_TYPE_ARG,
    nft,
    orderbook: ORDERBOOK_ID,
    oldPrice: price,
    newPrice: 275_000_000,
    transaction: tx,
  });

  tx.setGasBudget(100_000_000);
  const result = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: { showEffects: true },
  });

  console.log("result: ", result);
};

editAsk();
