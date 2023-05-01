import { SUI_TYPE_ARG, TransactionBlock } from "@mysten/sui.js";
import {
  ORDERBOOK_ID,
  COLLECTION_ID_NAME,
  signer,
  getKiosks,
  ORDERBOOK_PACKAGE_ID,
} from "./common";
import { OrderbookFullClient } from "../src";

export const placeBid = async () => {
  const pubkeyAddress = await signer.getAddress();
  console.log("Address: ", pubkeyAddress);

  const kiosks = await getKiosks();

  if (kiosks.length === 0) {
    console.debug("No kiosks found");
    return;
  }

  let tx = new TransactionBlock();
  const coinCreationResult = tx.splitCoins(tx.gas, [tx.pure(100_000_000)]);

  [tx] = OrderbookFullClient.createBidTx({
    packageObjectId: ORDERBOOK_PACKAGE_ID,
    buyersKiosk: kiosks[0].id.id,
    collection: COLLECTION_ID_NAME,
    ft: SUI_TYPE_ARG,
    orderbook: ORDERBOOK_ID,
    price: 65_000_000,
    wallet: coinCreationResult,
    transaction: tx,
  });

  const transferRes = tx.transferObjects(
    [coinCreationResult],
    tx.pure(pubkeyAddress)
  );
  tx.setGasBudget(100_000_000);

  // console.debug("tx: ", tx.blockData);

  const result = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: { showEffects: true },
  });

  console.log("result", JSON.stringify(result));
};

placeBid();
