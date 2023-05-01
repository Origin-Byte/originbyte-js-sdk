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

export const cancelBid = async () => {
  const pubkeyAddress = await signer.getAddress();
  console.log("Address: ", pubkeyAddress);

  const kiosks = await getKiosks();
  if (kiosks.length === 0) {
    console.error("No kiosks found");
    return;
  }

  const kiosk = kiosks[0];

  const orderbook = await orderbookClient.fetchOrderbook(ORDERBOOK_ID, true);
  // console.log("orderbook: ", orderbook)

  if (orderbook.bids.length === 0) {
    console.error("No bids found");
    return;
  }

  const bidToCancel = orderbook.bids.find((bid) => bid.kiosk === kiosk.id.id);

  if (bidToCancel === undefined) {
    console.error("No bids from user in the orderbook found");
    return;
  }

  let tx = new TransactionBlock();
  const coinCreationResult = tx.splitCoins(tx.gas, [tx.pure(100_000_000)]);

  [tx] = OrderbookFullClient.cancelBidTx({
    packageObjectId: ORDERBOOK_PACKAGE_ID,
    wallet: coinCreationResult,
    collection: COLLECTION_ID_NAME,
    ft: SUI_TYPE_ARG,
    orderbook: ORDERBOOK_ID,
    price: bidToCancel.offer,
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

cancelBid();
