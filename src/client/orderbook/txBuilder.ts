import { MoveCallTransaction, SuiJsonValue } from "@mysten/sui.js";
import {
  DEFAULT_GAS_BUDGET,
  DEFAULT_ORDERBOOK_MODULE,
  DEFAULT_PACKAGE_ID,
} from "../consts";
import {
  AllowlistParam,
  BuyerSafeParam,
  CollectionParam,
  CommissionParams,
  FTParam,
  GlobalParams,
  NftParam,
  OrderbookParam,
  PriceParam,
  SellerSafeParam,
  TradeParam,
  TransferCapParam,
  WalletParam,
} from "../types";

function txObj(
  fun: string,
  p: GlobalParams,
  args: SuiJsonValue[],
  tArgs: string[]
): MoveCallTransaction {
  return {
    packageObjectId: p.packageObjectId ?? DEFAULT_PACKAGE_ID,
    module: p.moduleName ?? DEFAULT_ORDERBOOK_MODULE,
    function: fun,
    typeArguments: tArgs,
    arguments: args,
    gasBudget: p.gasBudget ?? DEFAULT_GAS_BUDGET,
  };
}

export type OrderbookTParams = GlobalParams & CollectionParam & FTParam;
export type OrderbookParams = OrderbookTParams & OrderbookParam;
export type DebitParams = PriceParam & WalletParam;

export const createOrderbookTx = (p: OrderbookTParams) => {
  return txObj("create", p, [], [p.collection, p.ft]);
};

export const createAskTx = (
  p: OrderbookParams & TransferCapParam & PriceParam & SellerSafeParam
) => {
  return txObj(
    "create_ask",
    p,
    [p.orderbook, p.price, p.transferCap, p.sellerSafe],
    [p.collection, p.ft]
  );
};

export const createAskWithCommissionTx = (
  p: OrderbookParams &
    TransferCapParam &
    CommissionParams &
    PriceParam &
    SellerSafeParam
) => {
  return txObj(
    "create_ask_with_commission",
    p,
    [
      p.orderbook,
      p.price,
      p.transferCap,
      p.beneficiary,
      p.commission,
      p.sellerSafe,
    ],
    [p.collection, p.ft]
  );
};

export const buyNftTx = (
  p: OrderbookParams &
    NftParam &
    DebitParams &
    SellerSafeParam &
    BuyerSafeParam &
    AllowlistParam
) => {
  return txObj(
    "buy_nft",
    p,
    [
      p.orderbook,
      p.nft,
      p.price,
      p.wallet,
      p.sellerSafe,
      p.buyerSafe,
      p.allowlist,
    ],
    [p.collection, p.ft]
  );
};

export const cancelAskTx = (p: OrderbookParams & NftParam & PriceParam) => {
  return txObj(
    "cancel_ask",
    p,
    [p.orderbook, p.price, p.nft],
    [p.collection, p.ft]
  );
};

export const finishTradeTx = (
  p: OrderbookTParams &
    SellerSafeParam &
    BuyerSafeParam &
    AllowlistParam &
    TradeParam
) => {
  return txObj(
    "finish_trade",
    p,
    [p.trade, p.sellerSafe, p.buyerSafe, p.allowlist],
    [p.collection, p.ft]
  );
};

export const createBidTx = (
  p: OrderbookParams & DebitParams & BuyerSafeParam
) => {
  return txObj(
    "create_bid",
    p,
    [p.orderbook, p.buyerSafe, p.price, p.wallet],
    [p.collection, p.ft]
  );
};

export const createBidWithCommissionTx = (
  p: OrderbookParams & CommissionParams & DebitParams & BuyerSafeParam
) => {
  return txObj(
    "create_bid_with_commission",
    p,
    [p.orderbook, p.buyerSafe, p.price, p.beneficiary, p.commission, p.wallet],
    [p.collection, p.ft]
  );
};

export const cancelBidTx = (p: OrderbookParams & PriceParam & WalletParam) => {
  return txObj(
    "cancel_bid",
    p,
    [p.orderbook, p.price, p.wallet],
    [p.collection, p.ft]
  );
};
