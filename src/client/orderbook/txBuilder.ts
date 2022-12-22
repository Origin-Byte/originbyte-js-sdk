import { MoveCallTransaction } from "@mysten/sui.js";
import { CreateOrderbookParams } from "./types";

const DEFAULT_MODULE = "ob";
const DEFAULT_GAS_BUDGET = 5000;

export const createOrderbookTx = (
  params: CreateOrderbookParams
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
