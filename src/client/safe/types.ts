import { ObjectId } from "@mysten/sui.js";
import { GlobalParams } from "../types";

export interface CreateSafeForSenderParams extends GlobalParams {}

export interface AuthorizationParams extends GlobalParams {
  ownerCap: ObjectId;
  safe: ObjectId;
}

export interface DepositsOfCollectionParams extends AuthorizationParams {
  setPermission: "enable" | "disable";
  collection: string;
}

export interface DepositNftParams extends GlobalParams {
  nft: ObjectId;
  safe: ObjectId;
  collection: string;
}

export interface DepositNftPrivilegedParams extends AuthorizationParams {
  nft: ObjectId;
  collection: string;
}

export interface CreateTransferCapForSenderParams extends AuthorizationParams {
  nft: ObjectId;
}
