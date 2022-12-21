export type ObjectId = string;

export interface GlobalParams {
  gasBudget?: number;
  moduleName?: string;
  packageObjectId: ObjectId;
}

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
}

export interface DepositNftPrivilegedParams extends AuthorizationParams {
  nft: ObjectId;
}
