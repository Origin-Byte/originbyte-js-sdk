/* eslint-disable camelcase */
import {
  GetObjectDataResponse, ObjectOwner, SuiObject,
} from '@mysten/sui.js';

export interface NftCollectionRpcResponse {
  name: string
  symbol: string
  receiver: string
  initial_price: number
  total_supply: number
  current_supply: number
  has_public_transfer: boolean
  id: { id: string }
}

export interface ArtNftRpcResponse {
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
  rawResponse: GetObjectDataResponse
}

export interface ArtNft {
  name: string;
  attributes: { [c: string]: string };
  collectionId: string;
  url: string;
  ownerAddress: string
  owner: ObjectOwner
  type: string
  rawResponse: GetObjectDataResponse
}

export interface ArtNftWithCollection {
  data: ArtNft
  collection: NftCollection
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

export interface BuildBurnCollectionParams {
  collectionId: string
  packageObjectId: string
}

export type FetchFnParser<RpcResponse, DataModel> = (
  typedData: RpcResponse,
  suiObject: SuiObject,
  rpcResponse: GetObjectDataResponse
) => DataModel | undefined

export interface SuiObjectParser<RpcResponse, DataModel> {
  parser: FetchFnParser<RpcResponse, DataModel>
  regex: RegExp
}
