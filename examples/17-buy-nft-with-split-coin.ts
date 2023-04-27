import { SUI_TYPE_ARG, TransactionBlock } from "@mysten/sui.js";
import {
  ORDERBOOK_ID,
  orderbookClient,
  COLLECTION_ID_NAME,
  getSafeAndOwnerCap,
  getGas,
  ALLOW_LIST_ID,
  kioskClient,
  signer,
} from "./common";
import { OrderbookFullClient } from "../src";

export const buyNFT = async () => {
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

  const kiosks = await kioskClient.getWalletKiosks(pubkeyAddress);
  if (kiosks.length === 0) {
    console.error("No kiosks found");
    return;
  }

  const kiosk = kiosks[0];

  const { nft } = ask;
  const sellersKiosk = ask.kiosk;
  const askPrice = ask.price;

  let tx = new TransactionBlock();
  // const coinCreationResult = tx.splitCoins(tx.gas, [tx.pure(askPrice)]);

  [tx] = OrderbookFullClient.buyNftTx({
    sellersKiosk,
    buyersKiosk: kiosk.id.id,
    collection: COLLECTION_ID_NAME,
    ft: SUI_TYPE_ARG,
    nft,
    orderbook: ORDERBOOK_ID,
    price: askPrice,
    // wallet: coinCreationResult,
    wallet:
      "0x25750263a91cdd03f516689d09609897ee942428b246a3a3b59e35e7198eb5cd",
    transaction: tx,
  });

  // const transferRes = tx.transferObjects(
  //   [coinCreationResult],
  //   tx.pure(pubkeyAddress)
  // );
  tx.setGasBudget(100_000_000);

  console.log("tx: ", tx.blockData);
  console.log("tx: ", tx.blockData.transactions[1]);

  const result = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: { showEffects: true },
  });

  console.log("result: ", result);
};

buyNFT();
