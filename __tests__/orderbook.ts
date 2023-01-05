import { SUI_TYPE_ARG } from "@mysten/sui.js";
import {
  fetchNfts,
  getGas,
  orderbookClient,
  safeClient,
  TESTRACT_TYPE,
  user,
} from "./common";

export default function suite() {
  test("create orderbook", async () => {
    const { orderbook } = await orderbookClient.createOrderbook({
      collection: TESTRACT_TYPE,
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
      collection: TESTRACT_TYPE,
      ft: SUI_TYPE_ARG,
    });

    await orderbookClient.createBid({
      buyerSafe: safe,
      collection: TESTRACT_TYPE,
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
      collection: TESTRACT_TYPE,
    });
    const { transferCap } =
      await safeClient.createExclusiveTransferCapForSender({
        safe,
        nft,
        ownerCap,
      });

    const { orderbook } = await orderbookClient.createOrderbook({
      collection: TESTRACT_TYPE,
      ft: SUI_TYPE_ARG,
    });

    await orderbookClient.createAsk({
      sellerSafe: safe,
      collection: TESTRACT_TYPE,
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
      collection: TESTRACT_TYPE,
      ft: SUI_TYPE_ARG,
    });

    const someBeneficiary = "0xe71f60229c0ed838b7fe25f0ce57690b7067f199";
    await orderbookClient.createBidWithCommission({
      buyerSafe: safe,
      collection: TESTRACT_TYPE,
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
      collection: TESTRACT_TYPE,
    });
    const { transferCap } =
      await safeClient.createExclusiveTransferCapForSender({
        safe,
        nft,
        ownerCap,
      });

    const { orderbook } = await orderbookClient.createOrderbook({
      collection: TESTRACT_TYPE,
      ft: SUI_TYPE_ARG,
    });

    const someBeneficiary = "0xe71f60229c0ed838b7fe25f0ce57690b7067f199";
    await orderbookClient.createAskWithCommission({
      sellerSafe: safe,
      collection: TESTRACT_TYPE,
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
}
