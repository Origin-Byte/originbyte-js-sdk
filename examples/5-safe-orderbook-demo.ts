/* eslint-disable no-console */

// eslint-disable-next-line
import * as pressAnyKey from "press-any-key";
import {
  MoveCallTransaction,
  ObjectId,
  TransactionEffects,
} from "@mysten/sui.js";
import { OrderbookClient, SafeClient } from "../src";
import { parseObjectOwner } from "../src/client/utils";
import {
  PACKAGE_OBJECT_ID,
  signer,
  provider,
  SUI_CURRENCY_TYPE,
} from "./common";

const COLLECTION_PACKAGE_ID = "0xbe9a9258e0a84f8b319d4f15d85da7086d0f6106";
const COLLECTION_TYPE = `${COLLECTION_PACKAGE_ID}::suimarines::SUIMARINES`;
const WHITELIST_ID = "0x7a1f1693af3c830a4f8f2b55d6df5625ad3ac83e";
const NFT_ID = "0x5dfba214a714a99bbddfff54427d8c795f7812b8";

async function sendTx(tx: MoveCallTransaction): Promise<TransactionEffects> {
  const res = await signer.executeMoveCall(tx);
  if (typeof res !== "object" || !("EffectsCert" in res)) {
    throw new Error(
      `Response does not contain EffectsCert: ${JSON.stringify(res)}`
    );
  }

  console.log(`(tx digest ${res.EffectsCert.certificate.transactionDigest})`);
  return res.EffectsCert.effects.effects;
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

async function pressToContinue(msg: string) {
  console.log();
  console.log(msg);
  await pressAnyKey("Press any key to continue ...");
}

const main = async () => {
  await pressToContinue("Creating Safe object for sender ...");
  const [sellerSafeId, sellerOwnerCapId] = await createSafe();

  await pressToContinue(`Depositing NFT ${NFT_ID} to Safe ${sellerSafeId} ...`);
  await sendTx(
    SafeClient.depositNftTx({
      packageObjectId: PACKAGE_OBJECT_ID,
      safe: sellerSafeId,
      nft: NFT_ID,
      collection: COLLECTION_TYPE,
    })
  );

  await pressToContinue(
    `Creating transfer cap with owner cap ${sellerOwnerCapId} ...`
  );
  const createTransferCapRes = await sendTx(
    SafeClient.createExclusiveTransferCapForSenderTx({
      packageObjectId: PACKAGE_OBJECT_ID,
      safe: sellerSafeId,
      nft: NFT_ID,
      ownerCap: sellerOwnerCapId,
    })
  );
  const transferCapId = createTransferCapRes.created[0].reference.objectId;
  console.log(`Transfer cap created: ${transferCapId}`);

  await pressToContinue("Creating orderbook ...");
  const createOrderbookRes = await sendTx(
    OrderbookClient.createOrderbookTx({
      packageObjectId: PACKAGE_OBJECT_ID,
      collection: COLLECTION_TYPE,
      ft: SUI_CURRENCY_TYPE,
    })
  );

  const orderbookId = createOrderbookRes.created[0].reference.objectId;

  await pressToContinue(`Creating ask order in orderbook ${orderbookId} ...`);
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

  await pressToContinue("Creating second safe into which we deposit NFT ...");
  const [buyerSafeId, _buyerOwnerCapId] = await createSafe();

  await pressToContinue(
    `Buying NFT and depositing to second safe ${buyerSafeId} ...`
  );
  const coinId = await coinWithBalanceGreaterThanOrEqual(ASK_AMOUNT);
  const buyNftRes = await sendTx(
    OrderbookClient.buyNftTx({
      packageObjectId: PACKAGE_OBJECT_ID,
      collection: COLLECTION_TYPE,
      ft: SUI_CURRENCY_TYPE,
      book: orderbookId,
      nft: NFT_ID,
      sellerSafe: sellerSafeId,
      buyerSafe: buyerSafeId,
      wallet: coinId,
      price: ASK_AMOUNT,
      whitelist: WHITELIST_ID,
    })
  );

  const [object1, object2] = buyNftRes.created;
  // creates two objects, one of which is the trade payment (shared)
  const tradePaymentId =
    parseObjectOwner(object1.owner) === "shared"
      ? object1.reference.objectId
      : object2.reference.objectId;

  await pressToContinue(
    `Redeem royalty of trade payment ${tradePaymentId} ...`
  );
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
