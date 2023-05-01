import { SUI_TYPE_ARG, TransactionBlock } from "@mysten/sui.js";
import {
  ORDERBOOK_ID,
  COLLECTION_ID_NAME,
  signer,
  getKiosks,
  ORDERBOOK_PACKAGE_ID,
  orderbookClient,
} from "./common";
import { OrderbookFullClient } from "../src";

export const marketBuy = async () => {
  const pubkeyAddress = await signer.getAddress();
  console.log("Address: ", pubkeyAddress);

  const orderbookStateInitial = await orderbookClient.fetchOrderbook(
    ORDERBOOK_ID
  );

  if (orderbookStateInitial.asks.length === 0) {
    console.error("No asks to buy in the orderbook");

    return;
  }

  const ask = orderbookStateInitial.asks[0];

  if (!ask) {
    console.log("No such NFT listed on provided orderbook");
    return;
  }

  const kiosks = await getKiosks();
  if (kiosks.length === 0) {
    console.error("No kiosks found");
    return;
  }

  const kiosk = kiosks[0];

  const { nft } = ask;
  const sellersKiosk = ask.kiosk;
  const maxAskPrice = ask.price;

  let tx = new TransactionBlock();
  const coinCreationResult = tx.splitCoins(tx.gas, [tx.pure(maxAskPrice)]);

  const [txBuyNftBlock, buyNftResult] = OrderbookFullClient.marketBuyTx({
    packageObjectId: ORDERBOOK_PACKAGE_ID,
    buyersKiosk: kiosk.id.id,
    collection: COLLECTION_ID_NAME,
    ft: SUI_TYPE_ARG,
    orderbook: ORDERBOOK_ID,
    price: maxAskPrice,
    wallet: coinCreationResult,
    transaction: tx,
  });
  tx = txBuyNftBlock;

  const transferRes = tx.transferObjects(
    [coinCreationResult],
    tx.pure(pubkeyAddress)
  );
  tx.setGasBudget(100_000_000);

  console.log("tx: ", tx.blockData);
//   console.log("tx: ", tx.blockData.transactions[1]);

  const result = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: { showEffects: true },
  });

  console.log("result: ", result);
};

marketBuy();
