/**
 * Keeps trading NFTs between bunch of saves.
 */

import { ObjectId } from "@mysten/sui.js";
import { DEFAULT_GAS_BUDGET } from "../src/client/consts";
import {
  NFT_PROTOCOL_ADDRESS,
  orderbookClient,
  safeClient,
  TESTRACT_ADDRESS,
  TESTRACT_OTW_TYPE,
  user,
} from "./common";

console.warn = () => {};

/**
 * Taken from https://www.npmjs.com/package/random
 *
 * https://en.wikipedia.org/wiki/Normal_distribution
 */
const normalDistribution = function (mu: number, sigma: number) {
  let x: number, y: number, r: number;
  do {
    x = Math.random() * 2 - 1;
    y = Math.random() * 2 - 1;
    r = x * x + y * y;
  } while (!r || r > 1);
  return mu + sigma * y * Math.sqrt((-2 * Math.log(r)) / r);
};

// Initial setup
const SAVES_WITH_NFTS_COUNT = 5;
const NFTS_PER_SAFE = 5;
const SAVES_WITHOUT_NFTS_COUNT = 15;
// After each tick, in which we trade NFTs, we sleep for this amount of time
const SLEEP_AFTER_TICK_MS = 1000;
// Price distributions
const BID_DISTRIBUTION = () => Math.round(normalDistribution(510, 70));
const ASK_DISTRIBUTION = () => Math.round(normalDistribution(520, 50));

const tradeIntermediaries: string[] = [];

async function createSafeWithNfts() {
  const { safe, ownerCap } = await safeClient.createSafeForSender();

  await safeClient.client.sendTxWaitForEffects({
    packageObjectId: TESTRACT_ADDRESS!,
    module: "testract",
    function: "mint_n_nfts",
    typeArguments: [],
    arguments: [String(NFTS_PER_SAFE), safe],
    gasBudget: DEFAULT_GAS_BUDGET * 10,
  });

  return { safe, ownerCap };
}

async function createAsk(
  nftToList: ObjectId,
  orderbook: ObjectId,
  safe: ObjectId,
  ownerCap: ObjectId
): Promise<boolean> {
  const { transferCap } = await safeClient.createExclusiveTransferCapForSender({
    safe,
    ownerCap,
    nft: nftToList,
  });

  const price = ASK_DISTRIBUTION();
  console.log("Creating ask for", price);
  const { trade } = await orderbookClient.createAsk({
    collection: TESTRACT_OTW_TYPE,
    ft: TESTRACT_OTW_TYPE,
    orderbook,
    price,
    sellerSafe: safe,
    transferCap,
  });

  if (trade) {
    tradeIntermediaries.push(trade);
  }

  return true;
}

async function createBid(
  treasury: ObjectId,
  orderbook: ObjectId,
  safe: ObjectId
) {
  const price = BID_DISTRIBUTION();
  console.log("Creating bid for", price);
  const { created } = await orderbookClient.client.sendTxWaitForEffects({
    packageObjectId: TESTRACT_ADDRESS!,
    module: "testract",
    function: "create_bid",
    typeArguments: [],
    arguments: [String(price), safe, treasury, orderbook],
    gasBudget: DEFAULT_GAS_BUDGET,
  });

  const trade = created?.find(
    (obj) => typeof obj.owner === "object" && "Shared" in obj.owner
  );
  if (trade) {
    tradeIntermediaries.push(trade.reference.objectId);
  }
}

async function getTreasuryAndAllowlist(): Promise<{
  treasury: ObjectId;
  allowlist: ObjectId;
}> {
  const objs = await orderbookClient.client.getObjects(user);

  const treasury = objs.find(
    (obj) =>
      obj.type ===
      `0x2::coin::TreasuryCap<${TESTRACT_ADDRESS}::testract::TESTRACT>`
  )?.objectId;
  if (!treasury) {
    objs
      .filter((obj) => obj.type.includes("TreasuryCap"))
      .forEach((obj) => console.log(obj.type));
    throw new Error("Treasury not found");
  }

  const allowlist = objs.find(
    (obj) =>
      obj.type === `${NFT_PROTOCOL_ADDRESS}::transfer_allowlist::Allowlist`
  )?.objectId;
  if (!allowlist) {
    objs
      .filter((obj) => obj.type.includes("Allowlist"))
      .forEach((obj) => console.log(obj.type));
    throw new Error("Allowlist not found");
  }

  return { treasury, allowlist };
}

async function finishAllTrades(allowlist: ObjectId) {
  while (tradeIntermediaries.length !== 0) {
    const trade = tradeIntermediaries.pop()!;
    console.log("Finishing trade...");
    const { transferCap, buyerSafe } =
      await orderbookClient.fetchTradeIntermediary(trade);
    if (!transferCap) {
      throw new Error("Expected transfer cap to be present");
    }
    const { tradePayments } = await orderbookClient.finishTrade({
      trade,
      allowlist,
      collection: TESTRACT_OTW_TYPE,
      ft: TESTRACT_OTW_TYPE,
      buyerSafe,
      sellerSafe: transferCap.safe,
    });
    if (tradePayments.length !== 1) {
      throw new Error("Expected exactly one TradePayment object");
    }
    await safeClient.client.sendTxWaitForEffects({
      packageObjectId: TESTRACT_ADDRESS!,
      module: "testract",
      function: "collect_royalty",
      typeArguments: [],
      arguments: [tradePayments[0]],
      gasBudget: DEFAULT_GAS_BUDGET,
    });
  }
}

async function tick(
  orderbook: ObjectId,
  saves: Array<{ safe: ObjectId; ownerCap: ObjectId }>
) {
  const { treasury, allowlist } = await getTreasuryAndAllowlist();

  while (true) {
    const safeIndex = Math.floor(Math.random() * saves.length);
    const { safe, ownerCap } = saves[safeIndex];

    const { nfts } = await safeClient.fetchSafe(safe);
    const nftToList = nfts.find((nft) => nft.transferCapsCount === 0);

    // we don't want to execute a trade where both seller and buyer is the same
    // safe
    const { asks, bids } = await orderbookClient.fetchOrderbook(
      orderbook,
      true // sort
    );

    if (nftToList && !(bids.length > 0 && bids[0].safe === safe)) {
      await createAsk(nftToList.id, orderbook, safe, ownerCap);
    } else if (!(asks.length > 0 && asks[0].transferCap.safe === safe)) {
      await createBid(treasury, orderbook, safe);
    }

    await finishAllTrades(allowlist);

    await new Promise((resolve) => setTimeout(resolve, SLEEP_AFTER_TICK_MS));
  }
}

async function main() {
  const { orderbook } = await orderbookClient.createOrderbook({
    ft: TESTRACT_OTW_TYPE,
    collection: TESTRACT_OTW_TYPE,
  });

  console.log(`Creating ${SAVES_WITH_NFTS_COUNT} safes with NFTs...`);
  const saves: Array<{ safe: ObjectId; ownerCap: ObjectId }> = [];
  for (let i = 0; i < SAVES_WITH_NFTS_COUNT; i++) {
    saves.push(await createSafeWithNfts());
  }
  console.log(`Creating ${SAVES_WITHOUT_NFTS_COUNT} empty safes...`);
  for (let i = 0; i < SAVES_WITHOUT_NFTS_COUNT; i++) {
    const { safe, ownerCap } = await safeClient.createSafeForSender();
    saves.push({ safe, ownerCap });
  }

  await tick(orderbook, saves);
}

main();
