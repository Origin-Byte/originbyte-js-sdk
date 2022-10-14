/* eslint-disable camelcase */
import {
  GetObjectDataResponse, ObjectOwner, SuiObject,
} from '@mysten/sui.js';

export interface NftCollectionRpcResponse {
  name: string
  description: string
  symbol: string
  receiver: string
  royalty_fee_bps: number
  mint_authority: string
  creators: string
  // cap: {
  //   type: string
  //   fields: {
  //     supply: {
  //       type: string
  //       fields: {
  //         cap: number
  //         current: number
  //         frozen: boolean
  //       }
  //     }
  //   }
  // }
  tags: {
    type: string
    fields: {
      enumerations: {
        type: string
        fields: {
          contents: {
            type: string
            fields: {
              key: 0
              value: string
            }
          }[]
        }
      }
    }
  }
  metadata: {
    type: string
    fields: {
      id: {
        id: string
      }
      json: string
    }
  }
}

export interface MintAuthorityRPCResponse {
  collection_id: string
  supply_policy: {
    type: string
    fields: {
      is_blind: boolean,
      supply: {
        type: string
        fields: {
          current: number,
          frozen: boolean,
          max: number
        }
      }
    }
  }
}

export interface MintAuthority {
  id: string
  collectionId: string
  isBlind: boolean
  currentSupply: number
  maxSupply: number
  frozen: boolean
  rawResponse: GetObjectDataResponse
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
  description: string
  creators: string
  symbol: string
  // currentSupply: number
  // totalSupply: number
  receiver: string
  mintAuthorityId: string
  type: string
  id: string
  tags: string[]
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
  id: string
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
  resolveAuthorities?: boolean
}

export interface GetAuthoritiesParams extends WithIds {
}

export interface BuildFixedPriceSlingshotParams {
  collectionId: string
  packageObjectId: string
  admin: string,
  receiver: string,
  price: number,
}

export interface BuildBuyNftCertificateParams {
  coin: string
  launchpadId: string
  packageObjectId: string
}

export interface BuildClaimNftParams {
  nft: string
  launchpadId: string
  certificate: string
  recepient: string
  packageObjectId: string
}

export interface BuildMintNftParams {
  name: string
  description: string
  url: string
  attributes: { [c: string]: string };
  mintAuthority: string
  packageObjectId: string
  launchpadId: string
  index: number
  saleIndex?: number
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
