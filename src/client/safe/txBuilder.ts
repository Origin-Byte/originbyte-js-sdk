import { TransactionBlock } from "@mysten/sui.js";
import {
  AuthParam,
  CollectionParam,
  GlobalParams,
  NftParam,
  SafeParam,
  TransferCapParam,
} from "../types";
import { DEFAULT_PACKAGE_ID, DEFAULT_SAFE_MODULE } from "../consts";
import { TransactionResult } from "../orderbook/txBuilder";
import { txObj as txCommon } from "../../transaction";

export type NftParams = GlobalParams & NftParam & SafeParam;
export type AuthParams = GlobalParams & SafeParam & AuthParam;
export type ColAuthParams = AuthParams & CollectionParam;
export type NftAuthParams = AuthParam & NftParams;

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
      moduleName: p.moduleName ?? DEFAULT_SAFE_MODULE,
      fun,
      transaction: p.transaction,
    },
    args,
    tArgs
  );
}

function authNftArgs(p: NftParam & AuthParam & SafeParam, t: TransactionBlock) {
  return [t.object(p.nft), t.object(p.ownerCap), t.object(p.safe)];
}

export const createSafeForSenderTx = (p: GlobalParams) => {
  return txObj("create_for_sender", p, () => [], []);
};

export const restrictDepositsTx = (p: AuthParams) => {
  return txObj(
    "restrict_deposits",
    p,
    (t) => [t.object(p.ownerCap), t.object(p.safe)],
    []
  );
};

export const enableAnyDepositTx = (p: AuthParams) => {
  return txObj(
    "enable_any_deposit",
    p,
    (t) => [t.object(p.ownerCap), t.object(p.safe)],
    []
  );
};

export const enableDepositsOfCollectionTx = (p: ColAuthParams) => {
  const fun = "enable_deposits_of_collection";
  return txObj(fun, p, (t) => [t.object(p.ownerCap), t.object(p.safe)], [
    p.collection,
  ]);
};

export const disableDepositsOfCollectionTx = (p: ColAuthParams) => {
  const fun = "disable_deposits_of_collection";
  return txObj(fun, p, (t) => [t.object(p.ownerCap), t.object(p.safe)], [
    p.collection,
  ]);
};

export const depositNftTx = (p: NftParams & CollectionParam) => {
  return txObj("deposit_nft", p, (t) => [t.object(p.nft), t.object(p.safe)], [
    p.collection,
  ]);
};

export const depositGenericNftTx = (p: NftParams & CollectionParam) => {
  return txObj(
    "deposit_generic_nft",
    p,
    (t) => [t.object(p.nft), t.object(p.safe)],
    [p.collection]
  );
};

export const depositNftPrivilegedTx = (p: ColAuthParams & NftParam) => {
  return txObj("deposit_nft_privileged", p, (t) => authNftArgs(p, t), [
    p.collection,
  ]);
};

export const depositGenericNftPrivilegedTx = (p: ColAuthParams & NftParam) => {
  const fun = "deposit_generic_nft_privileged";
  return txObj(fun, p, (t) => authNftArgs(p, t), [p.collection]);
};

export const createTransferCapForSenderTx = (p: NftAuthParams) => {
  const fun = "create_transfer_cap_for_sender";
  return txObj(fun, p, (t) => authNftArgs(p, t), []);
};

export const createExclusiveTransferCapForSenderTx = (p: NftAuthParams) => {
  const fun = "create_exclusive_transfer_cap_for_sender";
  return txObj(fun, p, (t) => authNftArgs(p, t), []);
};

export const delistNftTx = (p: NftAuthParams) => {
  return txObj("delist_nft", p, (t) => authNftArgs(p, t), []);
};

export const burnTransferCapTx = (
  p: GlobalParams & TransferCapParam & SafeParam
) => {
  return txObj(
    "burn_transfer_cap",
    p,
    (t) => [t.object(p.transferCap), t.object(p.safe)],
    []
  );
};
