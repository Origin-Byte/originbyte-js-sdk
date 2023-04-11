import { ObjectId } from "@mysten/sui.js";
import { BuyersKioskParam, CommissionParams, FTParam, GlobalParams, NftParam, PriceParam, SellersKioskParam, WalletParam } from "../types";

export interface BidCommission {
  beneficiary: string;
  amount: string;
}

export interface Bid {
    id: string;
    nft: string;
    buyer: string;
    kiosk: string;
    offer: string;
    commission?: BidCommission;
}

export interface CreateBidInput extends GlobalParams, FTParam, BuyersKioskParam, NftParam, WalletParam, PriceParam {}

export interface CreateBidWithCommissionInput 
extends GlobalParams, FTParam, NftParam, WalletParam, BuyersKioskParam, CommissionParams, PriceParam {}

export interface SellNftFromKiosk extends GlobalParams, FTParam, SellersKioskParam, BuyersKioskParam, NftParam {
    bid: ObjectId,
}

export interface SellNft extends GlobalParams, FTParam, NftParam, BuyersKioskParam {
    bid: ObjectId
}