import { SUI_TYPE_ARG } from "@mysten/sui.js";
import {
  fetchGenericNfts,
  fetchNfts,
  getGas,
  NFT_GENERIC_TYPE,
  NFT_PROTOCOL_ADDRESS,
  orderbookClient,
  safeClient,
  TESTRACT_OTW_TYPE,
  user,
} from "./common";

export default function suite() {
  test("create orderbook", async () => {
    const { orderbook } = await orderbookClient.createOrderbook({
      collection: TESTRACT_OTW_TYPE,
      ft: SUI_TYPE_ARG,
    });
    const state = await orderbookClient.fetchOrderbook(orderbook);
    expect(state.asks.length).toBe(0);
    expect(state.bids.length).toBe(0);
    expect(state.protectedActions).toStrictEqual({
      buyNft: false,
      cancelAsk: false,
      cancelBid: false,
      createAsk: false,
      createBid: false,
    });
  });

  test("create bid", async () => {
    const { safe } = await safeClient.createSafeForSender();

    const { orderbook } = await orderbookClient.createOrderbook({
      collection: TESTRACT_OTW_TYPE,
      ft: SUI_TYPE_ARG,
    });

    await orderbookClient.createBid({
      buyerSafe: safe,
      collection: TESTRACT_OTW_TYPE,
      ft: SUI_TYPE_ARG,
      orderbook,
      price: 10,
      wallet: await getGas(),
    });

    const state = await orderbookClient.fetchOrderbook(orderbook);
    expect(state.bids.length).toBe(1);
    expect(state.bids[0].offer).toBe(10);
    expect(state.bids[0].owner).toBe(`0x${user}`);
    expect(state.bids[0].safe).toBe(safe);
    expect(state.bids[0].commission).toBeUndefined();
  });

  test("create ask", async () => {
    const allNfts = await fetchNfts();
    expect(allNfts.length).toBeGreaterThan(0);
    const nft = allNfts[0];
    const { safe, ownerCap } = await safeClient.createSafeForSender();
    await safeClient.depositNft({
      safe,
      nft,
      collection: TESTRACT_OTW_TYPE,
    });
    const { transferCap } =
      await safeClient.createExclusiveTransferCapForSender({
        safe,
        nft,
        ownerCap,
      });

    const { orderbook } = await orderbookClient.createOrderbook({
      collection: TESTRACT_OTW_TYPE,
      ft: SUI_TYPE_ARG,
    });

    await orderbookClient.createAsk({
      sellerSafe: safe,
      collection: TESTRACT_OTW_TYPE,
      ft: SUI_TYPE_ARG,
      orderbook,
      transferCap,
      price: 10,
    });

    const state = await orderbookClient.fetchOrderbook(orderbook);
    expect(state.asks.length).toBe(1);
    expect(state.asks[0].price).toBe(10);
    expect(state.asks[0].owner).toBe(`0x${user}`);
    expect(state.asks[0].transferCap.nft).toBe(nft);
    expect(state.asks[0].commission).toBeUndefined();
  });

  test("create bid with commission", async () => {
    const { safe } = await safeClient.createSafeForSender();

    const { orderbook } = await orderbookClient.createOrderbook({
      collection: TESTRACT_OTW_TYPE,
      ft: SUI_TYPE_ARG,
    });

    const someBeneficiary = "0xe71f60229c0ed838b7fe25f0ce57690b7067f199";
    await orderbookClient.createBidWithCommission({
      buyerSafe: safe,
      collection: TESTRACT_OTW_TYPE,
      ft: SUI_TYPE_ARG,
      orderbook,
      price: 10,
      wallet: await getGas(),
      beneficiary: someBeneficiary,
      commission: 5,
    });

    const state = await orderbookClient.fetchOrderbook(orderbook);
    expect(state.bids.length).toBe(1);
    expect(state.bids[0].offer).toBe(10);
    expect(state.bids[0].owner).toBe(`0x${user}`);
    expect(state.bids[0].safe).toBe(safe);
    expect(state.bids[0].commission).toStrictEqual({
      beneficiary: someBeneficiary,
      cut: 5,
    });
  });

  test("create ask with commission", async () => {
    const allNfts = await fetchNfts();
    expect(allNfts.length).toBeGreaterThan(0);
    const nft = allNfts[0];
    const { safe, ownerCap } = await safeClient.createSafeForSender();
    await safeClient.depositNft({
      safe,
      nft,
      collection: TESTRACT_OTW_TYPE,
    });
    const { transferCap } =
      await safeClient.createExclusiveTransferCapForSender({
        safe,
        nft,
        ownerCap,
      });

    const { orderbook } = await orderbookClient.createOrderbook({
      collection: TESTRACT_OTW_TYPE,
      ft: SUI_TYPE_ARG,
    });

    const someBeneficiary = "0xe71f60229c0ed838b7fe25f0ce57690b7067f199";
    await orderbookClient.createAskWithCommission({
      sellerSafe: safe,
      collection: TESTRACT_OTW_TYPE,
      ft: SUI_TYPE_ARG,
      orderbook,
      transferCap,
      price: 10,
      beneficiary: someBeneficiary,
      commission: 5,
    });

    const state = await orderbookClient.fetchOrderbook(orderbook);
    expect(state.asks.length).toBe(1);
    expect(state.asks[0].price).toBe(10);
    expect(state.asks[0].owner).toBe(`0x${user}`);
    expect(state.asks[0].transferCap.nft).toBe(nft);
    expect(state.asks[0].commission).toStrictEqual({
      beneficiary: someBeneficiary,
      cut: 5,
    });
  });

  test("buy generic NFT", async () => {
    const allNfts = await fetchGenericNfts();
    expect(allNfts.length).toBeGreaterThan(0);
    const nft = allNfts[0];

    const { safe: sellerSafe, ownerCap: sellerOwnerCap } =
      await safeClient.createSafeForSender();
    await safeClient.depositGenericNft({
      safe: sellerSafe,
      nft,
      collection: NFT_GENERIC_TYPE,
    });
    const { transferCap } =
      await safeClient.createExclusiveTransferCapForSender({
        safe: sellerSafe,
        nft,
        ownerCap: sellerOwnerCap,
      });
    const { orderbook } = await orderbookClient.createOrderbook({
      collection: NFT_GENERIC_TYPE,
      ft: SUI_TYPE_ARG,
    });

    await orderbookClient.createAsk({
      sellerSafe,
      collection: NFT_GENERIC_TYPE,
      ft: SUI_TYPE_ARG,
      orderbook,
      transferCap,
      price: 10,
    });

    const state = await orderbookClient.fetchOrderbook(orderbook);
    expect(state.asks.length).toBe(1);
    expect(state.asks[0].price).toBe(10);
    expect(state.asks[0].owner).toBe(`0x${user}`);
    expect(state.asks[0].transferCap.nft).toBe(nft);
    expect(state.asks[0].transferCap.isGeneric).toBe(true);

    const { safe: buyerSafe, ownerCap: buyerOwnerCap } =
      await safeClient.createSafeForSender();

    await orderbookClient.buyGenericNft({
      buyerSafe,
      collection: NFT_GENERIC_TYPE,
      ft: SUI_TYPE_ARG,
      nft,
      orderbook,
      price: 10,
      sellerSafe,
      wallet: await getGas(),
    });

    await safeClient.createTransferCapForSender({
      safe: buyerSafe,
      nft,
      ownerCap: buyerOwnerCap,
    });
  });

  test("cancel bid", async () => {
    const { safe } = await safeClient.createSafeForSender();

    const { orderbook } = await orderbookClient.createOrderbook({
      collection: TESTRACT_OTW_TYPE,
      ft: SUI_TYPE_ARG,
    });

    const wallet = await getGas();

    await orderbookClient.createBid({
      buyerSafe: safe,
      collection: TESTRACT_OTW_TYPE,
      ft: SUI_TYPE_ARG,
      orderbook,
      price: 10,
      wallet,
    });

    await orderbookClient.cancelBid({
      collection: TESTRACT_OTW_TYPE,
      ft: SUI_TYPE_ARG,
      orderbook,
      price: 10,
      wallet,
    });
  });

  test("cancel ask", async () => {
    const allNfts = await fetchNfts();
    expect(allNfts.length).toBeGreaterThan(0);
    const nft = allNfts[0];
    const { safe, ownerCap } = await safeClient.createSafeForSender();
    await safeClient.depositNft({
      safe,
      nft,
      collection: TESTRACT_OTW_TYPE,
    });
    const { transferCap } =
      await safeClient.createExclusiveTransferCapForSender({
        safe,
        nft,
        ownerCap,
      });

    const { orderbook } = await orderbookClient.createOrderbook({
      collection: TESTRACT_OTW_TYPE,
      ft: SUI_TYPE_ARG,
    });

    await orderbookClient.createAsk({
      sellerSafe: safe,
      collection: TESTRACT_OTW_TYPE,
      ft: SUI_TYPE_ARG,
      orderbook,
      transferCap,
      price: 10,
    });

    await orderbookClient.cancelAsk({
      collection: TESTRACT_OTW_TYPE,
      ft: SUI_TYPE_ARG,
      nft,
      orderbook,
      price: 10,
    });
  });

  // this test depends on all the other tests running first
  test("events are emitted", async () => {
    const { events } = await orderbookClient.fetchEvents({
      packageId: NFT_PROTOCOL_ADDRESS!,
    });

    expect(events.length).toBeGreaterThan(0);
  });
}
