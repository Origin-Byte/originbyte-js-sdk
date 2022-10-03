import { ObjectOwner } from '@mysten/sui.js';

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

export interface Nft {
  name: string;
  attributes: { [c: string]: string };
  collectionId: string;
  url: string;
  ownerAddress: string
  owner: ObjectOwner
  type: string
}

export interface GetNftsParams {
  objectIds: string[]
}

export interface BuildNftParams {
  packageObjectId: string
  name: string
  uri: string
  attributes: { [c:string]: string }
  collectionId: string
  recepient: string
  coin: string
}
