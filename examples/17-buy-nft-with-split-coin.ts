import { SUI_TYPE_ARG, TransactionBlock } from "@mysten/sui.js";
import {
  ORDERBOOK_ID,
  orderbookClient,
  COLLECTION_ID_NAME,
  signer,
  getKiosks,
  ORDERBOOK_PACKAGE_ID,
  ALLOW_LIST_ID,
  TRANSFER_REQUEST_POLICY_ID,
  CONTRACT_BPS_ROYALTY_STRATEGY_ID,
} from "./common";
import { OrderbookFullClient, TransferRequestFullClient } from "../src";

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

  const kiosks = await getKiosks();
  if (kiosks.length === 0) {
    console.error("No kiosks found");
    return;
  }

  const kiosk = kiosks[0];

  const { nft } = ask;
  const sellersKiosk = ask.kiosk;
  const askPrice = ask.price;

  let tx = new TransactionBlock();
  const coinCreationResult = tx.splitCoins(tx.gas, [tx.pure(askPrice)]);

  const [txBuyNftBlock, buyNftResult] = OrderbookFullClient.buyNftTx({
    packageObjectId: ORDERBOOK_PACKAGE_ID,
    sellersKiosk,
    buyersKiosk: kiosk.id.id,
    collection: COLLECTION_ID_NAME,
    ft: SUI_TYPE_ARG,
    nft,
    orderbook: ORDERBOOK_ID,
    price: askPrice,
    wallet: coinCreationResult,
    transaction: tx,
  });
  tx = txBuyNftBlock;

  TransferRequestFullClient.confirmTx({
    transaction: tx,
    transferRequest: buyNftResult,
    allowListId: ALLOW_LIST_ID,
    policyId: TRANSFER_REQUEST_POLICY_ID,
    bpsRoyaltyStrategy: CONTRACT_BPS_ROYALTY_STRATEGY_ID,
    ft: SUI_TYPE_ARG,
    transferRequestType: COLLECTION_ID_NAME,
  });

  const transferRes = tx.transferObjects(
    [coinCreationResult],
    tx.pure(pubkeyAddress)
  );
  tx.setGasBudget(100_000_000);

  console.log("tx: ", tx.blockData);

  const result = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: { showEffects: true },
  });

  console.log("result: ", result);
};

buyNFT();
