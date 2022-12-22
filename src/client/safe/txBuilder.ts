import { MoveCallTransaction } from "@mysten/sui.js";
import {
  CreateSafeForSenderParams,
  AuthorizationParams,
  DepositsOfCollectionParams,
  DepositNftParams,
  DepositNftPrivilegedParams,
  CreateTransferCapForSenderParams,
} from "./types";

const DEFAULT_MODULE = "safe";
const DEFAULT_GAS_BUDGET = 5000;

export const createSafeForSenderTx = (
  params: CreateSafeForSenderParams
): MoveCallTransaction => {
  return {
    packageObjectId: params.packageObjectId,
    module: params.moduleName ?? DEFAULT_MODULE,
    function: "create_for_sender",
    typeArguments: [],
    arguments: [],
    gasBudget: params.gasBudget ?? DEFAULT_GAS_BUDGET,
  };
};

export const restrictDepositsTx = (
  params: AuthorizationParams
): MoveCallTransaction => {
  return {
    packageObjectId: params.packageObjectId,
    module: params.moduleName ?? DEFAULT_MODULE,
    function: "restrict_deposits",
    typeArguments: [],
    arguments: [params.ownerCap, params.safe],
    gasBudget: params.gasBudget ?? DEFAULT_GAS_BUDGET,
  };
};

export const enableAnyDepositTx = (
  params: AuthorizationParams
): MoveCallTransaction => {
  return {
    packageObjectId: params.packageObjectId,
    module: params.moduleName ?? DEFAULT_MODULE,
    function: "enable_any_deposit",
    typeArguments: [],
    arguments: [params.ownerCap, params.safe],
    gasBudget: params.gasBudget ?? DEFAULT_GAS_BUDGET,
  };
};

export const setDepositsOfCollectionTx = (
  params: DepositsOfCollectionParams
) => {
  return {
    packageObjectId: params.packageObjectId,
    module: params.moduleName ?? DEFAULT_MODULE,
    function: `${params.setPermission}_deposits_of_collection`,
    typeArguments: [params.collection],
    arguments: [params.ownerCap, params.safe],
    gasBudget: params.gasBudget ?? DEFAULT_GAS_BUDGET,
  };
};

export const depositNftTx = (params: DepositNftParams): MoveCallTransaction => {
  return {
    packageObjectId: params.packageObjectId,
    module: params.moduleName ?? DEFAULT_MODULE,
    function: "deposit_nft",
    typeArguments: [params.collection],
    arguments: [params.nft, params.safe],
    gasBudget: params.gasBudget ?? DEFAULT_GAS_BUDGET,
  };
};

export const depositNftPrivilegedTx = (
  params: DepositNftPrivilegedParams
): MoveCallTransaction => {
  return {
    packageObjectId: params.packageObjectId,
    module: params.moduleName ?? DEFAULT_MODULE,
    function: "deposit_nft_privileged",
    typeArguments: [params.collection],
    arguments: [params.nft, params.ownerCap, params.safe],
    gasBudget: params.gasBudget ?? DEFAULT_GAS_BUDGET,
  };
};

export const depositGenericNftTx = (
  params: DepositNftParams
): MoveCallTransaction => {
  return {
    packageObjectId: params.packageObjectId,
    module: params.moduleName ?? DEFAULT_MODULE,
    function: "deposit_generic_nft",
    typeArguments: [params.collection],
    arguments: [params.nft, params.safe],
    gasBudget: params.gasBudget ?? DEFAULT_GAS_BUDGET,
  };
};

export const depositGenericNftPrivilegedTx = (
  params: DepositNftPrivilegedParams
): MoveCallTransaction => {
  return {
    packageObjectId: params.packageObjectId,
    module: params.moduleName ?? DEFAULT_MODULE,
    function: "deposit_generic_nft_privileged",
    typeArguments: [params.collection],
    arguments: [params.nft, params.ownerCap, params.safe],
    gasBudget: params.gasBudget ?? DEFAULT_GAS_BUDGET,
  };
};

export const createTransferCapForSenderTx = (
  params: CreateTransferCapForSenderParams
): MoveCallTransaction => {
  return {
    packageObjectId: params.packageObjectId,
    module: params.moduleName ?? DEFAULT_MODULE,
    function: "create_transfer_cap_for_sender",
    typeArguments: [],
    arguments: [params.nft, params.ownerCap, params.safe],
    gasBudget: params.gasBudget ?? DEFAULT_GAS_BUDGET,
  };
};

export const createExclusiveTransferCapForSenderTx = (
  params: CreateTransferCapForSenderParams
): MoveCallTransaction => {
  return {
    packageObjectId: params.packageObjectId,
    module: params.moduleName ?? DEFAULT_MODULE,
    function: "create_exclusive_transfer_cap_for_sender",
    typeArguments: [],
    arguments: [params.nft, params.ownerCap, params.safe],
    gasBudget: params.gasBudget ?? DEFAULT_GAS_BUDGET,
  };
};
