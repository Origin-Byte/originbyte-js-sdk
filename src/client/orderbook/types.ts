import { ObjectId } from "@mysten/sui.js";
import { GlobalParams } from "../types";

export interface OrderbookTypedParams extends GlobalParams {
  collection: string;
  ft: string;
}

export interface CreateAskParams extends OrderbookTypedParams {
  book: ObjectId;
  requestedTokens: number;
  transferCap: ObjectId;
  sellerSafe: ObjectId;
}

export interface BuyNftParams extends OrderbookTypedParams {
  book: ObjectId;
  nft: ObjectId;
  price: number;
  wallet: ObjectId;
  sellerSafe: ObjectId;
  buyerSafe: ObjectId;
  whitelist: ObjectId;
}
