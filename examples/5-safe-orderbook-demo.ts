/* eslint-disable no-console */

import {
  MoveCallTransaction,
  ObjectId,
  TransactionEffects,
} from "@mysten/sui.js";
import { OrderbookClient, SafeClient } from "../src";
import { parseObjectOwner } from "../src/client/utils";
import { PACKAGE_OBJECT_ID, signer, provider } from "./common";

const SUI_CURRENCY_TYPE = "0x2::sui::SUI";
const COLLECTION_PACKAGE_ID = "0xbe9a9258e0a84f8b319d4f15d85da7086d0f6106";
const COLLECTION_TYPE = `${COLLECTION_PACKAGE_ID}::suimarines::SUIMARINES`;
const WHITELIST_ID = "0x7a1f1693af3c830a4f8f2b55d6df5625ad3ac83e";

async function sendTx(tx: MoveCallTransaction): Promise<TransactionEffects> {
  const res = await signer.executeMoveCall(tx);
  if (typeof res !== "object" || !("EffectsCert" in res)) {
    throw new Error(
      `Response does not contain EffectsCert: ${JSON.stringify(res)}`
    );
  }

  return res.EffectsCert.effects.effects;
}

async function coinBalance(coinId: ObjectId): Promise<number> {
  const coin = await provider.getObject(coinId);
  return parseInt((coin.details as any).data.fields.balance, 10);
}

async function coinWithBalanceGreaterThanOrEqual(
  amount: number
): Promise<ObjectId> {
  const coins = await provider.selectCoinsWithBalanceGreaterThanOrEqual(
    await signer.getAddress(),
    BigInt(amount)
  );

  return (coins[0].details as any).reference.objectId;
}

async function createSafe(): Promise<[ObjectId, ObjectId]> {
  const createSafeRes = await sendTx(
    SafeClient.createSafeForSenderTx({
      packageObjectId: PACKAGE_OBJECT_ID,
    })
  );

  const [object1, object2] = createSafeRes.created;

  let safeId;
  let ownerCapId;

  if (parseObjectOwner(object1.owner) === "shared") {
    safeId = object1.reference.objectId;
    ownerCapId = object2.reference.objectId;
  } else {
    safeId = object2.reference.objectId;
    ownerCapId = object1.reference.objectId;
  }

  return [safeId, ownerCapId];
}

const main = async () => {
  console.log("Creating Safe object for sender ...");

  const nftId = "0x064521f4b243b7a7b06bc2b227e05da83cfb0715";

  const [sellerSafeId, sellerOwnerCapId] = await createSafe();

  console.log(`Depositing NFT ${nftId} to Safe ${sellerSafeId} ...`);
  await sendTx(
    SafeClient.depositNftTx({
      packageObjectId: PACKAGE_OBJECT_ID,
      safe: sellerSafeId,
      nft: nftId,
      collection: COLLECTION_TYPE,
    })
  );

  console.log(`Creating transfer cap with owner cap ${sellerOwnerCapId} ...`);
  const createTransferCapRes = await sendTx(
    SafeClient.createExclusiveTransferCapForSenderTx({
      packageObjectId: PACKAGE_OBJECT_ID,
      safe: sellerSafeId,
      nft: nftId,
      ownerCap: sellerOwnerCapId,
    })
  );

  const transferCapId = createTransferCapRes.created[0].reference.objectId;
  console.log(`Transfer cap created: ${transferCapId}`);

  console.log("Creating orderbook ...");
  const createOrderbookRes = await sendTx(
    OrderbookClient.createOrderbookTx({
      packageObjectId: PACKAGE_OBJECT_ID,
      collection: COLLECTION_TYPE,
      ft: SUI_CURRENCY_TYPE,
    })
  );

  const orderbookId = createOrderbookRes.created[0].reference.objectId;

  console.log(`Creating ask order in orderbook ${orderbookId}...`);
  const ASK_AMOUNT = 21;
  await sendTx(
    OrderbookClient.createAskTx({
      packageObjectId: PACKAGE_OBJECT_ID,
      collection: COLLECTION_TYPE,
      ft: SUI_CURRENCY_TYPE,
      book: orderbookId,
      transferCap: transferCapId,
      sellerSafe: sellerSafeId,
      requestedTokens: ASK_AMOUNT, // 21 SUI
    })
  );

  console.log("Creating second safe into which we deposit NFT...");
  const [buyerSafeId, _buyerOwnerCapId] = await createSafe();

  console.log(`Buying NFT into second safe ${buyerSafeId} ...`);
  const coinId = await coinWithBalanceGreaterThanOrEqual(ASK_AMOUNT);
  const buyNftRes = await sendTx(
    OrderbookClient.buyNftTx({
      packageObjectId: PACKAGE_OBJECT_ID,
      collection: COLLECTION_TYPE,
      ft: SUI_CURRENCY_TYPE,
      book: orderbookId,
      nft: nftId,
      sellerSafe: sellerSafeId,
      buyerSafe: buyerSafeId,
      wallet: coinId,
      price: ASK_AMOUNT,
      whitelist: WHITELIST_ID,
    })
  );

  console.log("Buying nft", buyNftRes);

  const [object1, object2] = buyNftRes.created;
  const tradePaymentId =
    parseObjectOwner(object1.owner) === "shared"
      ? object1.reference.objectId
      : object2.reference.objectId;

  console.log(`Redeem royalty of trade payment ${tradePaymentId}`);
  sendTx({
    packageObjectId: COLLECTION_PACKAGE_ID,
    module: "suimarines",
    function: "collect_royalty",
    typeArguments: [SUI_CURRENCY_TYPE],
    arguments: [tradePaymentId],
    gasBudget: 5000,
  });

  console.log("Trade successful!");
};

main();
