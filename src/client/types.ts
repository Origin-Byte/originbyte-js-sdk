/* eslint-disable camelcase */
import { ObjectOwner } from '@mysten/sui.js';

export interface NftCollectionRpcResponse {
  name: string
  symbol: string
  receiver: string
  initial_price: number
  total_supply: number
  current_supply: number
  has_public_transfer: boolean
  id: string
}

export interface NftRpcResponse {
  type: string
  // eslint-disable-next-line camelcase
  collection_id: string
  id: {
    id: string
  }
  metadata: {
    fields: {
      name: string
      url: string
      attributes: {
        fields: {
          keys: string[]
          values: string[]
        }
      }
    }
  }
}

export interface NftCollection {
  name: string
  symbol: string
  currentSupply: number
  totalSupply: number
  initialPrice: number
  receiver: string
  type: string
  id: string
}

export interface Nft {
  name: string;
  attributes: { [c: string]: string };
  collectionId: string;
  url: string;
  ownerAddress: string
  owner: ObjectOwner
  type: string
}

export interface WithIds {
  objectIds: string[]
}

export interface GetNftsParams extends WithIds {
}

export interface GetCollectionsParams extends WithIds {
}

export interface BuildNftCollectionParams {
  name: string
  symbol: string
  maxSupply: number
  initialPrice: number
  receiver: string
  tags?: string[]
  packageObjectId: string
  royalty?: number
}

export interface BuildPrivateNftCollectionParams extends BuildNftCollectionParams {
  recepient: string
 }

export interface BuildNftParams {
  packageObjectId: string
  name: string
  uri: string
  attributes: { [c: string]: string }
  collectionId: string
  recepient: string
  coin: string
}
