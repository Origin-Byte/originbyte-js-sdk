import { MoveCallTransaction, SuiJsonValue } from "@mysten/sui.js";
import {
  AuthParam,
  CollectionParam,
  GlobalParams,
  NftParam,
  SafeParam,
  TransferCapParam,
} from "../types";
import {
  DEFAULT_GAS_BUDGET,
  DEFAULT_PACKAGE_ID,
  DEFAULT_SAFE_MODULE,
} from "../consts";

export type NftParams = GlobalParams & NftParam & SafeParam;
export type AuthParams = GlobalParams & SafeParam & AuthParam;
export type ColAuthParams = AuthParams & CollectionParam;
export type NftAuthParams = AuthParam & NftParams;

function txObj(
  fun: string,
  p: GlobalParams,
  args: SuiJsonValue[],
  tArgs: string[]
): MoveCallTransaction {
  return {
    packageObjectId: p.packageObjectId ?? DEFAULT_PACKAGE_ID,
    module: p.moduleName ?? DEFAULT_SAFE_MODULE,
    function: fun,
    typeArguments: tArgs,
    arguments: args,
    gasBudget: p.gasBudget ?? DEFAULT_GAS_BUDGET,
  };
}

function authNftArgs(p: NftParam & AuthParam & SafeParam) {
  return [p.nft, p.ownerCap, p.safe];
}

export const createSafeForSenderTx = (p: GlobalParams) => {
  return txObj("create_for_sender", p, [], []);
};

export const restrictDepositsTx = (p: AuthParams) => {
  return txObj("restrict_deposits", p, [p.ownerCap, p.safe], []);
};

export const enableAnyDepositTx = (p: AuthParams) => {
  return txObj("enable_any_deposit", p, [p.ownerCap, p.safe], []);
};

export const enableDepositsOfCollectionTx = (p: ColAuthParams) => {
  const fun = "enable_deposits_of_collection";
  return txObj(fun, p, [p.ownerCap, p.safe], [p.collection]);
};

export const disableDepositsOfCollectionTx = (p: ColAuthParams) => {
  const fun = "disable_deposits_of_collection";
  return txObj(fun, p, [p.ownerCap, p.safe], [p.collection]);
};

export const depositNftTx = (p: NftParams & CollectionParam) => {
  return txObj("deposit_nft", p, [p.nft, p.safe], [p.collection]);
};

export const depositGenericNftTx = (p: NftParams & CollectionParam) => {
  return txObj("deposit_generic_nft", p, [p.nft, p.safe], [p.collection]);
};

export const depositNftPrivilegedTx = (p: ColAuthParams & NftParam) => {
  return txObj("deposit_nft_privileged", p, authNftArgs(p), [p.collection]);
};

export const depositGenericNftPrivilegedTx = (p: ColAuthParams & NftParam) => {
  const fun = "deposit_generic_nft_privileged";
  return txObj(fun, p, authNftArgs(p), [p.collection]);
};

export const createTransferCapForSenderTx = (p: NftAuthParams) => {
  const fun = "create_transfer_cap_for_sender";
  return txObj(fun, p, authNftArgs(p), []);
};

export const createExclusiveTransferCapForSenderTx = (p: NftAuthParams) => {
  const fun = "create_exclusive_transfer_cap_for_sender";
  return txObj(fun, p, authNftArgs(p), []);
};

export const delistNftTx = (p: NftAuthParams) => {
  return txObj("delist_nft", p, authNftArgs(p), []);
};

export const burnTransferCapTx = (
  p: GlobalParams & TransferCapParam & SafeParam
) => {
  return txObj("burn_transfer_cap", p, [p.transferCap, p.safe], []);
};
