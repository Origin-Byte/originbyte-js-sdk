import { SUI_TYPE_ARG, TransactionBlock } from "@mysten/sui.js";
import {
  ORDERBOOK_ID,
  orderbookClient,
  COLLECTION_ID_NAME,
  signer,
  getKiosks,
  ORDERBOOK_PACKAGE_ID,
} from "./common";
import { OrderbookFullClient } from "../src";

export const editBid = async () => {
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

  if (orderbook.bids.length === 0) {
    // console.error("No bids found");
    return;
  }

  const bidToEdit = orderbook.bids.find((bid) => bid.kiosk === kiosk.id.id);

  if (bidToEdit === undefined) {
    console.error("No bids from user in the orderbook found");
    return;
  }

  let tx = new TransactionBlock();
  const coinCreationResult = tx.splitCoins(tx.gas, [tx.pure(100_000_000)]);

  [tx] = OrderbookFullClient.editBidTx({
    packageObjectId: ORDERBOOK_PACKAGE_ID,
    buyersKiosk: kiosk.id.id,
    collection: COLLECTION_ID_NAME,
    ft: SUI_TYPE_ARG,
    orderbook: ORDERBOOK_ID,
    oldPrice: bidToEdit.offer,
    newPrice: 25_000_000,
    wallet: coinCreationResult,
    transaction: tx,
  });

  const transferRes = tx.transferObjects(
    [coinCreationResult],
    tx.pure(pubkeyAddress)
  );
  tx.setGasBudget(100_000_000);
  const result = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: { showEffects: true },
  });

  console.log("result: ", result);
};

editBid();
