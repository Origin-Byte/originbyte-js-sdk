import { TransactionBlock } from "@mysten/sui.js";
import {
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



export type TransactionBlockArgument = {
  kind: "Input";
  index: number;
  type?: "object" | "pure" | undefined;
  value?: any;
}

function txObj(
  fun: string,
  p: GlobalParams,
  args: TransactionBlockArgument[],
  tArgs: string[],
): TransactionBlock {

  const tx = p.transaction ?? new TransactionBlock();

  tx.moveCall({
    target: `${p.packageObjectId ?? DEFAULT_PACKAGE_ID}::${p.moduleName ?? DEFAULT_ORDERBOOK_MODULE}::${fun}`,
    typeArguments: tArgs,
    arguments: args
  });

  return tx;
}

export type OrderbookTParams = GlobalParams & CollectionParam & FTParam;
export type OrderbookParams = OrderbookTParams & OrderbookParam;
export type DebitParams = PriceParam & WalletParam;

const t = new TransactionBlock(); // serialization purposes

export const createOrderbookTx = (p: OrderbookTParams) => {
  return txObj("create", p, [], [p.collection, p.ft]);
};

export const createAskTx = (
  p: OrderbookParams & TransferCapParam & PriceParam & SellerSafeParam
) => {
  return txObj(
    "create_ask",
    p,
    [t.object(p.orderbook), t.pure(String(p.price)), t.object(p.transferCap), t.object(p.sellerSafe)],
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
      t.object(p.orderbook),
      t.pure(String(p.price)),
      t.object(p.transferCap),
      t.object(p.beneficiary),
      t.pure(String(p.commission)),
      t.object(p.sellerSafe),
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
    [t.object(p.orderbook), t.pure(String(p.price)), t.object(p.nft), t.object(p.ownerCap), t.object(p.sellerSafe)],
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
      t.object(p.orderbook),
      t.pure(String(p.price)),
      t.object(p.nft),
      t.object(p.ownerCap),
      t.object(p.beneficiary),
      t.pure(String(p.commission)),
      t.object(p.sellerSafe),
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
      t.object(p.orderbook),
      t.pure(p.prices.map(String)),
      t.pure(p.nfts),
      t.object(p.ownerCap),
      t.object(p.beneficiary),
      t.pure(p.commissions.map(String)),
      t.object(p.sellerSafe),
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
    [
      t.object(p.orderbook),
      t.object(p.nft),
      t.pure(String(p.price)),
      t.object(p.ownerCap),
      t.object(p.sellerSafe),
    ],
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
      t.object(p.orderbook),
      t.object(p.nft),
      t.pure(String(p.price)),
      t.object(p.ownerCap),
      t.object(p.beneficiary),
      t.pure(String(p.commission)),
      t.object(p.sellerSafe),
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
    [
      t.object(p.orderbook),
      t.object(p.nft),
      t.pure(String(p.price)),
    ],
    [p.nftType, p.collection, p.ft]
  );
};

export const createSafeAndDepositAndListNftWithCommissionTx = (
  p: OrderbookParams & PriceParam & NftParam & NftTypeParam & CommissionParams
) => {
  return txObj(
    "create_safe_and_deposit_and_list_nft_with_commission",
    p,
    [
      t.object(p.orderbook),
      t.object(p.nft),
      t.pure(String(p.price)),
      t.object(p.beneficiary),
      t.pure(String(p.commission)),
    ],
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
      t.object(p.orderbook),
      t.object(p.nft),
      t.pure(String(p.price)),
      t.object(p.wallet),
      t.object(p.sellerSafe),
      t.object(p.buyerSafe),
      t.object(p.allowlist),
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
    [
      t.object(p.orderbook),
      t.object(p.nft),
      t.pure(String(p.price)),
      t.object(p.wallet),
      t.object(p.sellerSafe),
      t.object(p.allowlist),
    ],
    [p.collection, p.ft]
  );
};

export const buyGenericNftTx = (
  p: OrderbookParams & NftParam & DebitParams & SellerSafeParam & BuyerSafeParam
) => {
  return txObj(
    "buy_generic_nft",
    p,
    [
      t.object(p.orderbook),
      t.object(p.nft),
      t.pure(String(p.price)),
      t.object(p.wallet),
      t.object(p.sellerSafe),
      t.object(p.buyerSafe),
    ],
    [p.collection, p.ft]
  );
};

export const cancelAskTx = (p: OrderbookParams & NftParam & PriceParam) => {
  return txObj(
    "cancel_ask",
    p,
    [
      t.object(p.orderbook),
      t.pure(String(p.price)),
      t.object(p.nft),
    ],
    [p.collection, p.ft]
  );
};

export const cancelAskAndDiscardTransferCapTx = (
  p: OrderbookParams & NftParam & PriceParam & SellerSafeParam
) => {
  return txObj(
    "cancel_ask_and_discard_transfer_cap",
    p,
    [
      t.object(p.orderbook),
      t.pure(String(p.price)),
      t.object(p.nft),
      t.object(p.sellerSafe),
    ],
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
    [
      t.object(p.orderbook),
      t.pure(String(p.oldPrice)),
      t.object(p.nft),
      t.pure(String(p.newPrice)),
      t.object(p.sellerSafe),
    ],
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
      t.object(p.orderbook),
      t.object(p.buyerSafe),
      t.pure(String(p.oldPrice)),
      t.pure(String(p.newPrice)),
      t.object(p.wallet),
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
    [
      t.object(p.trade),
      t.object(p.sellerSafe),
      t.object(p.buyerSafe),
      t.object(p.allowlist),
    ],
    [p.collection, p.ft]
  );
};

export const finishTradeOfGenericNftTx = (
  p: OrderbookTParams & SellerSafeParam & BuyerSafeParam & TradeParam
) => {
  return txObj(
    "finish_trade_of_generic_nft",
    p,
    [
      t.object(p.trade),
      t.object(p.sellerSafe),
      t.object(p.buyerSafe),
    ],
    [p.collection, p.ft]
  );
};

export const createBidTx = (
  p: OrderbookParams & DebitParams & BuyerSafeParam
) => {
  return txObj(
    "create_bid",
    p,
    [
      t.object(p.orderbook),
      t.object(p.buyerSafe),
      t.pure(String(p.price)),
      t.object(p.wallet),
    ],
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
      t.object(p.orderbook),
      t.object(p.buyerSafe),
      t.pure(String(p.price)),
      t.object(p.beneficiary),
      t.pure(String(p.commission)),
      t.object(p.wallet),
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
      t.object(p.orderbook),
      t.pure(String(p.price)),
      t.object(p.beneficiary),
      t.pure(String(p.commission)),
      t.object(p.wallet),
    ],
    [p.collection, p.ft]
  );
};

export const cancelBidTx = (p: OrderbookParams & PriceParam & WalletParam) => {
  return txObj(
    "cancel_bid",
    p,
    [
      t.object(p.orderbook),
      t.pure(String(p.price)),
      t.object(p.wallet),
    ],
    [p.collection, p.ft]
  );
};
