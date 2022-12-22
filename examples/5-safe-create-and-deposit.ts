import { ObjectId } from "@mysten/sui.js";
import { SafeClient } from "../src";
import { parseObjectOwner } from "../src/client/utils";
import { PACKAGE_OBJECT_ID, signer, provider } from "./common";

const SUI_COIN_TYPE =
  "0x0000000000000000000000000000000000000002::coin::Coin<0x0000000000000000000000000000000000000002::sui::SUI>";

async function coinBalance(coinId: ObjectId): Promise<number> {
  const coin = await provider.getObject(coinId);
  return parseInt((coin.details as any).data.fields.balance, 10);
}

/**
 * Temporarily we work with `Coin<SUI>` of balance = 1 as NFT.
 */
async function generateCoinNft(): Promise<ObjectId> {
  const coins = await provider.selectCoinsWithBalanceGreaterThanOrEqual(
    await signer.getAddress(),
    BigInt(2)
  );
  const coinId = (coins[0].details as any).reference.objectId;

  const res = await signer.splitCoin({
    coinObjectId: coinId,
    splitAmounts: [(await coinBalance(coinId)) - 1, 1],
    gasBudget: 30000,
  });
  if (typeof res !== "object" || !("EffectsCert" in res)) {
    throw new Error("Response does not contain EffectsCert");
  }

  const coinsAfter = res.EffectsCert.effects.effects.created;
  if ((await coinBalance(coinsAfter[0].reference.objectId)) === 1) {
    return coinsAfter[0].reference.objectId;
  }

  return coinsAfter[1].reference.objectId;
}

const main = async () => {
  console.log("Creating Safe object for sender ...");
  const createSafeRes = await signer.executeMoveCall(
    SafeClient.createSafeForSenderTx({
      packageObjectId: PACKAGE_OBJECT_ID,
    })
  );
  if (typeof createSafeRes !== "object" || !("EffectsCert" in createSafeRes)) {
    throw new Error("Response does not contain EffectsCert");
  }

  const [object1, object2] = createSafeRes.EffectsCert.effects.effects.created;

  let safeId;
  let ownerCapId;

  if (parseObjectOwner(object1.owner) === "shared") {
    safeId = object1.reference.objectId;
    ownerCapId = object2.reference.objectId;
  } else {
    safeId = object2.reference.objectId;
    ownerCapId = object1.reference.objectId;
  }
  const nftId = await generateCoinNft();

  console.log(`Depositing NFT ${nftId} to Safe ${safeId} ...`);
  await signer.executeMoveCall(
    SafeClient.depositGenericNftTx({
      packageObjectId: PACKAGE_OBJECT_ID,
      safe: safeId,
      nft: nftId,
      collection: SUI_COIN_TYPE,
    })
  );

  console.log(`Creating transfer cap with owner cap ${ownerCapId} ...`);
  const createTransferCapRes = await signer.executeMoveCall(
    SafeClient.createExclusiveTransferCapForSenderTx({
      packageObjectId: PACKAGE_OBJECT_ID,
      safe: safeId,
      nft: nftId,
      ownerCap: ownerCapId,
    })
  );
  if (
    typeof createTransferCapRes !== "object" ||
    !("EffectsCert" in createTransferCapRes)
  ) {
    throw new Error("Response does not contain EffectsCert");
  }

  const transferCapId =
    createTransferCapRes.EffectsCert.effects.effects.created[0].reference
      .objectId;
  console.log(`Transfer cap created: ${transferCapId}`);
};

main();
