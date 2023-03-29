import { TransactionBlock } from "@mysten/sui.js";
import {
  AuthParam,
  CollectionParam,
  GlobalParams,
  NftParam,
  SafeParam,
  TransferCapParam,
} from "../types";
import {
  DEFAULT_PACKAGE_ID,
  DEFAULT_SAFE_MODULE,
} from "../consts";

export type NftParams = GlobalParams & NftParam & SafeParam;
export type AuthParams = GlobalParams & SafeParam & AuthParam;
export type ColAuthParams = AuthParams & CollectionParam;
export type NftAuthParams = AuthParam & NftParams;

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
    target: `${p.packageObjectId ?? DEFAULT_PACKAGE_ID}::${p.moduleName ?? DEFAULT_SAFE_MODULE}::${fun}`,
    typeArguments: tArgs,
    arguments: args
  });

  return tx;
}

const t = new TransactionBlock(); // serialization purposes

function authNftArgs(p: NftParam & AuthParam & SafeParam) {
  return [t.object(p.nft), t.object(p.ownerCap), t.object(p.safe)];
}

export const createSafeForSenderTx = (p: GlobalParams) => {
  return txObj("create_for_sender", p, [], []);
};

export const restrictDepositsTx = (p: AuthParams) => {
  return txObj("restrict_deposits", p, [t.object(p.ownerCap), t.object(p.safe)], []);
};

export const enableAnyDepositTx = (p: AuthParams) => {
  return txObj("enable_any_deposit", p, [t.object(p.ownerCap), t.object(p.safe)], []);
};

export const enableDepositsOfCollectionTx = (p: ColAuthParams) => {
  const fun = "enable_deposits_of_collection";
  return txObj(fun, p, [t.object(p.ownerCap), t.object(p.safe)], [p.collection]);
};

export const disableDepositsOfCollectionTx = (p: ColAuthParams) => {
  const fun = "disable_deposits_of_collection";
  return txObj(fun, p, [t.object(p.ownerCap), t.object(p.safe)], [p.collection]);
};

export const depositNftTx = (p: NftParams & CollectionParam) => {
  return txObj("deposit_nft", p, [t.object(p.nft), t.object(p.safe)], [p.collection]);
};

export const depositGenericNftTx = (p: NftParams & CollectionParam) => {
  return txObj("deposit_generic_nft", p, [t.object(p.nft), t.object(p.safe)], [p.collection]);
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
  return txObj("burn_transfer_cap", p, [t.object(p.transferCap), t.object(p.safe)], []);
};
