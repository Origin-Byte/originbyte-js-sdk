/* eslint-disable camelcase */
import { ObjectId, SuiAddress } from "@mysten/sui.js";
import { GlobalParams, KioskParam, NftParam, WithNftType } from "../types";

export interface OwnerToken {
    id: ObjectId,
    kiosk: ObjectId,
    owner: SuiAddress
}

export interface Kiosk {
   id: { id: string },
   profits: {value: number},
   owner: string,
   item_count: number,
   allow_extensions: boolean 
}

export interface DepositProps extends KioskParam, WithNftType, GlobalParams {}
export interface SetPermissionlessToPermissionedProps extends GlobalParams, KioskParam {
    user: string
}
export interface WithDrawNftProps extends KioskParam, NftParam, WithNftType, GlobalParams {
    entityId: string
}

export interface WithDrawNftSignedProps extends KioskParam, NftParam, WithNftType, GlobalParams {}

export interface TransferBetweenOwnedProps extends NftParam, WithNftType, GlobalParams {
    source: string,
    target: string
}

export interface DelistNftAsOwnerInputProps extends GlobalParams, KioskParam, NftParam {}

export interface AuthTransferProps extends GlobalParams, KioskParam, NftParam {
    entity: string
}

export interface AuthExclusiveTransferProps extends GlobalParams, NftParam, KioskParam {
    entity: string
}

export interface TransferDelegatedProps extends GlobalParams, NftParam {
    source: string,
    target: string,
    entityId: string,
    transferType: string
}

export interface TransferSignedProps extends GlobalParams, NftParam {
    source: string,
    target: string,
    transferType: string
}

export interface SetTransferRequestProps extends GlobalParams {
    transferRequestType: string,
    transferRequest: ObjectId,
    auth: ObjectId
}

export interface GetTransferRequestProps extends GlobalParams {
    transferRequestType: string,
    transferRequest: ObjectId
}

// Delisting of NFTs

export interface DelistNftAsOwnerProps extends GlobalParams, KioskParam, NftParam {}

export interface RemoveAuthTransferAsOwnerProps extends GlobalParams, KioskParam, NftParam {
    entity: string
}

export interface RemoveAuthTransferProps extends GlobalParams, KioskParam, NftParam {
    entity: string
}


// DEPOSIT SETTING CONFIGURATION

export interface RestrictDepositsProps extends GlobalParams, KioskParam {}

export interface EnableAnyDepositProps extends GlobalParams, KioskParam {}
export interface DisableDepositsOfCollectionProps extends GlobalParams, KioskParam {
    collectionType: string
}
export interface EnableDepositsOfCollectionProps extends GlobalParams, KioskParam {
    collectionType: string
}

// NFT Accessors

// TODO


