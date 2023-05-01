import { TransactionBlock } from "@mysten/sui.js";
import { DEFAULT_ORDERBOOK_MODULE, DEFAULT_PACKAGE_ID } from "../consts";
import {
  CollectionParam,
  CommissionParams,
  FTParam,
  GlobalParams,
  NftParam,
  OrderbookParam,
  PriceParam,
  TradeParam,
  WalletParam,
  OldPriceParam,
  NewPriceParam,
  BuyersKioskParam,
  SellersKioskParam,
} from "../types";
import { txObj as txCommon, TransactionResult } from "../../transaction";
import { wrapToObject } from "../utils";

export type TransactionBlockArgument = {
  kind: "Input";
  index: number;
  type?: "object" | "pure" | undefined;
  value?: any;
};

function txObj(
  fun: string,
  p: GlobalParams,
  args: (
    tx: TransactionBlock
  ) => (TransactionBlockArgument | TransactionResult)[],
  tArgs: string[]
): [TransactionBlock, TransactionResult] {
  return txCommon(
    {
      packageObjectId: p.packageObjectId ?? DEFAULT_PACKAGE_ID,
      moduleName: p.moduleName ?? DEFAULT_ORDERBOOK_MODULE,
      fun,
      transaction: p.transaction,
    },
    args,
    tArgs
  );
}

export type CreateProtectionParams = {
  buyNft: boolean;
  createAsk: boolean;
  createBid: boolean;
};

export type OrderbookTParams = GlobalParams & CollectionParam & FTParam;
export type ShareOrderbookParams = OrderbookTParams & {
  orderbook: TransactionResult;
};
export type OrderbookProtectionParams = GlobalParams & CreateProtectionParams;
export type OrderbookParams = OrderbookTParams & OrderbookParam;
export type DebitParams = PriceParam & WalletParam;

export const newOrderbookTx = (
  p: OrderbookTParams & {
    protectedActions: TransactionResult;
  }
) => {
  return txObj("new", p, () => [p.protectedActions], [p.collection, p.ft]);
};

export const newUnprotectedOrderbookTx = (p: OrderbookTParams) => {
  return txObj("new_unprotected", p, () => [], [p.collection, p.ft]);
};

export const createUnprotectedOrderbookTx = (p: OrderbookTParams) => {
  return txObj("create_unprotected", p, () => [], [p.collection, p.ft]);
};

export const shareOrderbookTx = (p: ShareOrderbookParams) => {
  return txObj("share", p, () => [p.orderbook], [p.collection, p.ft]);
};

export const createProtectionTx = (p: OrderbookProtectionParams) => {
  return txObj(
    "custom_protection",
    p,
    (t) => [t.pure(p.buyNft), t.pure(p.createAsk), t.pure(p.createBid)],
    []
  );
};
export const createUnprotectedTx = (p: GlobalParams) => {
  return txObj("no_protection", p, (t) => [], []);
};

export const createAskTx = (
  p: OrderbookParams & SellersKioskParam & PriceParam & NftParam
) => {
  return txObj(
    "create_ask",
    p,
    (t) => [
      t.object(p.orderbook),
      wrapToObject(t, p.sellersKiosk),
      t.pure(String(p.price)),
      t.object(p.nft),
    ],
    [p.collection, p.ft]
  );
};

export const createAskWithCommissionTx = (
  p: OrderbookParams &
    SellersKioskParam &
    PriceParam &
    NftParam &
    CommissionParams
) => {
  return txObj(
    "create_ask_with_commission",
    p,
    (t) => [
      t.object(p.orderbook),
      wrapToObject(t, p.sellersKiosk),
      t.pure(String(p.price)),
      t.object(p.nft),
      t.object(p.beneficiary),
      t.pure(String(p.commission)),
    ],
    [p.collection, p.ft]
  );
};

export const cancelAskTx = (
  p: OrderbookParams & SellersKioskParam & NftParam & PriceParam
) => {
  return txObj(
    "cancel_ask",
    p,
    (t) => [
      t.object(p.orderbook),
      wrapToObject(t, p.sellersKiosk),
      t.pure(String(p.price)),
      t.object(p.nft),
    ],
    [p.collection, p.ft]
  );
};

export const editAskTx = (
  p: OrderbookParams &
    NftParam &
    OldPriceParam &
    NewPriceParam &
    SellersKioskParam
) => {
  return txObj(
    "edit_ask",
    p,
    (t) => [
      t.object(p.orderbook),
      wrapToObject(t, p.sellersKiosk),
      t.pure(String(p.oldPrice)),
      t.object(p.nft),
      t.pure(String(p.newPrice)),
    ],
    [p.collection, p.ft]
  );
};

export const createBidTx = (
  p: OrderbookParams & DebitParams & BuyersKioskParam
) => {
  return txObj(
    "create_bid",
    p,
    (t) => [
      t.object(p.orderbook),
      wrapToObject(t, p.buyersKiosk),
      t.pure(String(p.price)),
      wrapToObject(t, p.wallet),
    ],
    [p.collection, p.ft]
  );
};

export const createBidWithCommissionTx = (
  p: OrderbookParams & CommissionParams & DebitParams & BuyersKioskParam
) => {
  return txObj(
    "create_bid_with_commission",
    p,
    (t) => [
      t.object(p.orderbook),
      wrapToObject(t, p.buyersKiosk),
      t.pure(String(p.price)),
      t.object(p.beneficiary),
      t.pure(String(p.commission)),
      wrapToObject(t, p.wallet),
    ],
    [p.collection, p.ft]
  );
};

export const editBidTx = (
  p: OrderbookParams &
    OldPriceParam &
    NewPriceParam &
    BuyersKioskParam &
    WalletParam
) => {
  return txObj(
    "edit_bid",
    p,
    (t) => [
      t.object(p.orderbook),
      wrapToObject(t, p.buyersKiosk),
      t.pure(String(p.oldPrice)),
      t.pure(String(p.newPrice)),
      wrapToObject(t, p.wallet),
    ],
    [p.collection, p.ft]
  );
};

export const cancelBidTx = (p: OrderbookParams & PriceParam & WalletParam) => {
  return txObj(
    "cancel_bid",
    p,
    (t) => [
      t.object(p.orderbook),
      t.pure(String(p.price)),
      wrapToObject(t, p.wallet),
    ],
    [p.collection, p.ft]
  );
};

export const finishTradeTx = (
  p: OrderbookParams &
    OrderbookTParams &
    BuyersKioskParam &
    SellersKioskParam &
    TradeParam
) => {
  return txObj(
    "finish_trade",
    p,
    (t) => [
      t.object(p.orderbook),
      t.object(p.trade),
      wrapToObject(t, p.sellersKiosk),
      wrapToObject(t, p.buyersKiosk),
    ],
    [p.collection, p.ft]
  );
};

export const buyNftTx = (
  p: OrderbookParams &
    NftParam &
    DebitParams &
    SellersKioskParam &
    BuyersKioskParam
) => {
  return txObj(
    "buy_nft",
    p,
    (t) => [
      t.object(p.orderbook),
      wrapToObject(t, p.sellersKiosk),
      wrapToObject(t, p.buyersKiosk),
      t.object(p.nft),
      t.pure(String(p.price)),
      wrapToObject(t, p.wallet),
    ],
    [p.collection, p.ft]
  );
};

export const marketBuyTx = (
  p: OrderbookParams & BuyersKioskParam & DebitParams
) => {
  return txObj(
    "market_buy",
    p,
    (t) => [
      t.object(p.orderbook),
      wrapToObject(t, p.buyersKiosk),
      wrapToObject(t, p.wallet),
      t.pure(String(p.price)),
    ],
    [p.collection, p.ft]
  );
};

export const marketSellTx = (
  p: OrderbookParams & SellersKioskParam & PriceParam & NftParam
) => {
  return txObj(
    "market_sell",
    p,
    (t) => [
      t.object(p.orderbook),
      wrapToObject(t, p.sellersKiosk),
      t.pure(String(p.price)),
      t.object(p.nft),
    ],
    [p.collection, p.ft]
  );
};
