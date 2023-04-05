import { OrderbookFullClient } from "../src";
import { NFT_TYPE, PACKAGE_OBJECT_ID, signer } from "./common";

export const createOrderbookMarket = async () => {
  const [protectionTx, protection] = OrderbookFullClient.createProtectionTx({
    packageObjectId: PACKAGE_OBJECT_ID,
    buyNft: false,
    cancelAsk: false,
    cancelBid: false,
    createAsk: false,
    createBid: false,
  });

  const [obTx, orderbook] = OrderbookFullClient.newOrderbookTx({
    transaction: protectionTx,
    packageObjectId: PACKAGE_OBJECT_ID,
    collection: NFT_TYPE,
    protectedActions: protection,
    ft: "0x2::sui::SUI",
  });

  const [shareOb] = OrderbookFullClient.shareOrderbookTx({
    transaction: obTx,
    orderbook,
    collection: NFT_TYPE,
    packageObjectId: PACKAGE_OBJECT_ID,
    ft: "0x2::sui::SUI",
  });

  shareOb.setGasBudget(1000000);

  const orderbookResult = await signer.signAndExecuteTransactionBlock({
    transactionBlock: shareOb,
    options: { showEffects: true, showObjectChanges: true },
  });

  console.log("OrderBook creation result:", orderbookResult);
};

createOrderbookMarket();
