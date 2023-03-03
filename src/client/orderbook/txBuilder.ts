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
  AuthParam,
  NftTypeParam,
  OldPriceParam,
  NewPriceParam,
  PricesParam,
  NftsParam,
  CommissionsParams,
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
    [p.orderbook, String(p.price), p.transferCap, p.sellerSafe],
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
      String(p.price),
      p.transferCap,
      p.beneficiary,
      String(p.commission),
      p.sellerSafe,
    ],
    [p.collection, p.ft]
  );
};

export const listNftTx = (
  p: OrderbookParams & PriceParam & NftParam & AuthParam & SellerSafeParam
) => {
  return txObj(
    "list_nft",
    p,
    [p.orderbook, String(p.price), p.nft, p.ownerCap, p.sellerSafe],
    [p.collection, p.ft]
  );
};

export const listNftWithCommissionTx = (
  p: OrderbookParams &
    PriceParam &
    NftParam &
    AuthParam &
    SellerSafeParam &
    CommissionParams
) => {
  return txObj(
    "list_nft_with_commission",
    p,
    [
      p.orderbook,
      String(p.price),
      p.nft,
      p.ownerCap,
      p.beneficiary,
      String(p.commission),
      p.sellerSafe,
    ],
    [p.collection, p.ft]
  );
};

export const listMultipleNftsWithCommissionTx = (
  p: OrderbookParams &
    PricesParam &
    NftsParam &
    AuthParam &
    SellerSafeParam &
    CommissionsParams
) => {
  return txObj(
    "list_multiple_nfts_with_commission",
    p,
    [
      p.orderbook,
      p.prices.map(String),
      p.nfts,
      p.ownerCap,
      p.beneficiary,
      p.commissions.map(String),
      p.sellerSafe,
    ],
    [p.collection, p.ft]
  );
};

export const depositAndlistNftTx = (
  p: OrderbookParams &
    PriceParam &
    NftParam &
    AuthParam &
    SellerSafeParam &
    NftTypeParam
) => {
  return txObj(
    "deposit_and_list_nft",
    p,
    [p.orderbook, p.nft, String(p.price), p.ownerCap, p.sellerSafe],
    [p.nftType, p.collection, p.ft]
  );
};

export const depositAndListNftWithCommissionTx = (
  p: OrderbookParams &
    PriceParam &
    CommissionParams &
    NftParam &
    AuthParam &
    SellerSafeParam &
    NftTypeParam
) => {
  return txObj(
    "deposit_and_list_nft_with_commission",
    p,
    [
      p.orderbook,
      p.nft,
      String(p.price),
      p.ownerCap,
      p.beneficiary,
      String(p.commission),
      p.sellerSafe,
    ],
    [p.nftType, p.collection, p.ft]
  );
};

export const createSafeAndDepositAndListNftTx = (
  p: OrderbookParams & PriceParam & NftParam & NftTypeParam
) => {
  return txObj(
    "create_safe_and_deposit_and_list_nft",
    p,
    [p.orderbook, p.nft, String(p.price)],
    [p.nftType, p.collection, p.ft]
  );
};

export const createSafeAndDepositAndListNftWithCommissionTx = (
  p: OrderbookParams & PriceParam & NftParam & NftTypeParam & CommissionParams
) => {
  return txObj(
    "create_safe_and_deposit_and_list_nft_with_commission",
    p,
    [p.orderbook, p.nft, String(p.price), p.beneficiary, String(p.commission)],
    [p.nftType, p.collection, p.ft]
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
      String(p.price),
      p.wallet,
      p.sellerSafe,
      p.buyerSafe,
      p.allowlist,
    ],
    [p.collection, p.ft]
  );
};

export const createSafeAndBuyNftTx = (
  p: OrderbookParams & NftParam & DebitParams & SellerSafeParam & AllowlistParam
) => {
  return txObj(
    "create_safe_and_buy_nft",
    p,
    [p.orderbook, p.nft, String(p.price), p.wallet, p.sellerSafe, p.allowlist],
    [p.collection, p.ft]
  );
};

export const buyGenericNftTx = (
  p: OrderbookParams & NftParam & DebitParams & SellerSafeParam & BuyerSafeParam
) => {
  return txObj(
    "buy_generic_nft",
    p,
    [p.orderbook, p.nft, String(p.price), p.wallet, p.sellerSafe, p.buyerSafe],
    [p.collection, p.ft]
  );
};

export const cancelAskTx = (p: OrderbookParams & NftParam & PriceParam) => {
  return txObj(
    "cancel_ask",
    p,
    [p.orderbook, String(p.price), p.nft],
    [p.collection, p.ft]
  );
};

export const cancelAskAndDiscardTransferCapTx = (
  p: OrderbookParams & NftParam & PriceParam & SellerSafeParam
) => {
  return txObj(
    "cancel_ask_and_discard_transfer_cap",
    p,
    [p.orderbook, String(p.price), p.nft, p.sellerSafe],
    [p.collection, p.ft]
  );
};

export const editAskTx = (
  p: OrderbookParams &
    NftParam &
    OldPriceParam &
    NewPriceParam &
    SellerSafeParam
) => {
  return txObj(
    "edit_ask",
    p,
    [p.orderbook, String(p.oldPrice), p.nft, String(p.newPrice), p.sellerSafe],
    [p.collection, p.ft]
  );
};

export const editBidTx = (
  p: OrderbookParams &
    OldPriceParam &
    NewPriceParam &
    BuyerSafeParam &
    WalletParam
) => {
  return txObj(
    "edit_bid",
    p,
    [
      p.orderbook,
      p.buyerSafe,
      String(p.oldPrice),
      String(p.newPrice),
      p.wallet,
    ],
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

export const finishTradeOfGenericNftTx = (
  p: OrderbookTParams & SellerSafeParam & BuyerSafeParam & TradeParam
) => {
  return txObj(
    "finish_trade_of_generic_nft",
    p,
    [p.trade, p.sellerSafe, p.buyerSafe],
    [p.collection, p.ft]
  );
};

export const createBidTx = (
  p: OrderbookParams & DebitParams & BuyerSafeParam
) => {
  return txObj(
    "create_bid",
    p,
    [p.orderbook, p.buyerSafe, String(p.price), p.wallet],
    [p.collection, p.ft]
  );
};

export const createBidWithCommissionTx = (
  p: OrderbookParams & CommissionParams & DebitParams & BuyerSafeParam
) => {
  return txObj(
    "create_bid_with_commission",
    p,
    [
      p.orderbook,
      p.buyerSafe,
      String(p.price),
      p.beneficiary,
      String(p.commission),
      p.wallet,
    ],
    [p.collection, p.ft]
  );
};

export const createSafeAndBidWithCommissionTx = (
  p: OrderbookParams & CommissionParams & DebitParams
) => {
  return txObj(
    "create_safe_and_bid_with_commission",
    p,
    [
      p.orderbook,
      String(p.price),
      p.beneficiary,
      String(p.commission),
      p.wallet,
    ],
    [p.collection, p.ft]
  );
};

export const cancelBidTx = (p: OrderbookParams & PriceParam & WalletParam) => {
  return txObj(
    "cancel_bid",
    p,
    [p.orderbook, String(p.price), p.wallet],
    [p.collection, p.ft]
  );
};
