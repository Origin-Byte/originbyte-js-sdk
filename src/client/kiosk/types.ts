/* eslint-disable camelcase */
import { ObjectId, SuiAddress } from "@mysten/sui.js";

export interface OwnerToken {
    id: ObjectId,
    kiosk: ObjectId,
    owner: SuiAddress
}

export interface Kiosk {
   id: string,
   profits: {value: number},
   owner: string,
   item_count: number,
   allow_extensions: boolean 
}