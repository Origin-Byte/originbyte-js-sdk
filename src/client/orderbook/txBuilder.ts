import { MoveCallTransaction } from "@mysten/sui.js";
import { BuyNftParams, CreateAskParams, OrderbookTypedParams } from "./types";

const DEFAULT_MODULE = "ob";
const DEFAULT_GAS_BUDGET = 5000;

export const createOrderbookTx = (
  params: OrderbookTypedParams
): MoveCallTransaction => {
  return {
    packageObjectId: params.packageObjectId,
    module: params.moduleName ?? DEFAULT_MODULE,
    function: "create",
    typeArguments: [params.collection, params.ft],
    arguments: [],
    gasBudget: params.gasBudget ?? DEFAULT_GAS_BUDGET,
  };
};

export const createAskTx = (params: CreateAskParams): MoveCallTransaction => {
  return {
    packageObjectId: params.packageObjectId,
    module: params.moduleName ?? DEFAULT_MODULE,
    function: "create_ask",
    typeArguments: [params.collection, params.ft],
    arguments: [
      params.book,
      params.requestedTokens,
      params.transferCap,
      params.sellerSafe,
    ],
    gasBudget: params.gasBudget ?? DEFAULT_GAS_BUDGET,
  };
};

export const buyNftTx = (params: BuyNftParams): MoveCallTransaction => {
  return {
    packageObjectId: params.packageObjectId,
    module: params.moduleName ?? DEFAULT_MODULE,
    function: "buy_nft",
    typeArguments: [params.collection, params.ft],
    arguments: [
      params.book,
      params.nft,
      params.price,
      params.wallet,
      params.sellerSafe,
      params.buyerSafe,
      params.whitelist,
    ],
    gasBudget: params.gasBudget ?? DEFAULT_GAS_BUDGET,
  };
};
