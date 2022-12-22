/* eslint-disable no-console */

import {
  MoveCallTransaction,
  ObjectId,
  TransactionEffects,
} from "@mysten/sui.js";
import { OrderbookClient, SafeClient } from "../src";
import { parseObjectOwner } from "../src/client/utils";
import { PACKAGE_OBJECT_ID, signer, provider } from "./common";

const SUI_TYPE = "0x2::sui::SUI";
const SUI_COIN_TYPE = `0x2::coin::Coin<${SUI_TYPE}>`;
const WHITELIST_ID = "";

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

/**
 * Temporarily we work with `Coin<SUI>` of balance = 1 as NFT.
 */
async function generateCoinNft(): Promise<ObjectId> {
  const coinId = await coinWithBalanceGreaterThanOrEqual(2);

  const res = await signer.splitCoin({
    coinObjectId: coinId,
    splitAmounts: [(await coinBalance(coinId)) - 1, 1],
    gasBudget: 30000,
  });
  if (typeof res !== "object" || !("EffectsCert" in res)) {
    throw new Error(
      `Response does not contain EffectsCert: ${JSON.stringify(res)}`
    );
  }

  const coinsAfter = res.EffectsCert.effects.effects.created;
  if ((await coinBalance(coinsAfter[0].reference.objectId)) === 1) {
    return coinsAfter[0].reference.objectId;
  }

  return coinsAfter[1].reference.objectId;
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

  const nftId = await generateCoinNft();

  const [sellerSafeId, sellerOwnerCapId] = await createSafe();

  console.log(`Depositing NFT ${nftId} to Safe ${sellerSafeId} ...`);
  await sendTx(
    SafeClient.depositGenericNftTx({
      packageObjectId: PACKAGE_OBJECT_ID,
      safe: sellerSafeId,
      nft: nftId,
      collection: SUI_COIN_TYPE,
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
      collection: SUI_COIN_TYPE,
      ft: SUI_TYPE,
    })
  );

  const orderbookId = createOrderbookRes.created[0].reference.objectId;

  console.log(`Creating ask order in orderbook ${orderbookId}...`);
  const ASK_AMOUNT = 21;
  await sendTx(
    OrderbookClient.createAskTx({
      packageObjectId: PACKAGE_OBJECT_ID,
      collection: SUI_COIN_TYPE,
      ft: SUI_TYPE,
      book: orderbookId,
      transferCap: transferCapId,
      sellerSafe: sellerSafeId,
      requestedTokens: ASK_AMOUNT, // 21 SUI
    })
  );

  console.log("Creating second safe into which we deposit NFT...");
  const [buyerSafeId, _buyerOwnerCapId] = await createSafe();

  const coinId = await coinWithBalanceGreaterThanOrEqual(ASK_AMOUNT);

  const buyNftRes = await sendTx(
    OrderbookClient.buyNftTx({
      packageObjectId: PACKAGE_OBJECT_ID,
      collection: SUI_COIN_TYPE,
      ft: SUI_TYPE,
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

  // TODO: call royalty payment with the newly created trade payment
};

main();
