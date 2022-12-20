/* eslint-disable camelcase */
import {
  GetObjectDataResponse, ObjectOwner, SuiObject,
} from '@mysten/sui.js';

export interface WithPackageObjectId {
  packageObjectId: string
}
export interface WithId {
  id: string
}

export interface WithOwner {
  owner: string
}

export interface ProtocolData extends WithPackageObjectId {
  packageModule: string
  packageModuleClassName: string
}

type ID = {
  id: string
}

export interface NftCollectionRpcResponse {
  domains: {
    type: string
    fields: {
      id: ID,
      size: number
    }
  },
  id: ID,
}

export interface MintCapRPCResponse {
  collection_id: string
  supply_policy: {
    type: string
    fields: {
      regulated: boolean,
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

export interface FixedPriceMarketRpcResponse {
  price: number
}

export interface DomainRpcBase<T> {
  id: ID
  name: {
    type: string
    fields: {
      dummy_field: boolean
    }
  },
  value: {
    type: string
    fields: T
  }
}

export type ObjectBox = {
  type: string,
  fields: {
    id: ID
    len: number
  }
}

export type Bag = {
  type: string
  fields: {
    id: ID
    size: number
  }
}

export type RoyaltyDomainRpcResponse = DomainRpcBase<{
  aggregations: Bag,
  strategies: Bag
}>

export type SymbolDomainRpcResponse = DomainRpcBase<{
  symbol: string
}>

export type UrlDomainRpcResponse = DomainRpcBase<{
  url: string
}>

export type DisplayDomainRpcResponse = DomainRpcBase<{
  description: string
  name: string
}>

export type TagsDomainRpcResponse = DomainRpcBase<{
  bag: Bag
}>

export type TagRpcResponse = DomainRpcBase<{}>

export type AttributionDomainRpcResponse = DomainRpcBase<{
  creators: {
    type: string,
    fields: {
      contents: {
        type: string,
        fields: {
          key: string,
          value: {
            type: string,
            fields: {
              share_of_royalty_bps: number,
              who: string
            }
          }
        }
      }[]
    }
  }
}>

export interface DefaultFeeBoxRpcResponse {
  id: ID
  name: {
    type: string
    fields: {
      name: {
        type: string,
        fields: {
          name: string
        }
      }
    }
  },
  value: string
}

export interface LaunchpadSlotRpcResponse {
  admin: string
  launchpad: string
  receiver: string
  custom_fee: ObjectBox
  inventories: Bag
  markets: Bag
}

export interface LaunchpadSlot extends WithPackageObjectId, WithId {
  admin: string
  launchpad: string
  receiver: string
  customFeeBagId: string
  inventoriesBagId: string
  marketsBagId: string
}

export interface FlatFeeRfcRpcResponse {
  id: ID
  rate_bps: number
}

export interface FlatFee {
  id: string
  rateBps: number
}

export interface WithRawResponse {
  rawResponse: GetObjectDataResponse
}

export interface InventoryRpcResponse {
  queue: string
  nfts: string[]
}

export interface Inventory extends InventoryRpcResponse, WithId { }

export interface FixedPriceMarket extends WithRawResponse, WithId {
  price: number
}

export interface NftCertificateRpcResponse {
  nft_id: string
  launchpad_id: string
}

export interface NftCertificate extends WithRawResponse, WithId {
  nftId: string
  owner: string
  packageObjectId: string
  launchpadId: string
}

export interface LaunchpadRpcResponse {
  admin: string
  default_fee: {
    type: string,
    fields: {
      id: ID
      len: number
    }
  },
  id: ID
  permissioned: boolean
  receiver: string
}

export interface Launchpad extends WithId, WithPackageObjectId, WithRawResponse {
  owner: string
  admin: string
  receiver: string
  permissioned: boolean
  defaultFeeBoxId: string
}

export interface MintCap extends WithRawResponse, WithId {
  collectionId: string
  regulated: boolean
  currentSupply: number
  maxSupply: number
  frozen: boolean
}

export interface ArtNftRpcResponse {
  type: string
  data_id: string
  // eslint-disable-next-line camelcase
  data: {
    type: string
    fields: {
      attributes: {
        type: string
        fields: {
          keys: string[]
          values: string[]

        }
      },
      collection_id: string,
      description: string,
      id: ID
      name: string
      url: string
    }
  }
}

export interface NftCollection extends ProtocolData, WithId {
  domainsBagId: string
  rawResponse: GetObjectDataResponse
}

export interface ArtNft extends ProtocolData, WithRawResponse, WithId {
  name: string;
  attributes: { [c: string]: string };
  collectionId: string;
  url: string;
  ownerAddress: string
  owner: ObjectOwner
  type: string
}

export interface ArtNftWithCollection {
  data: ArtNft
  collection: NftCollection
}

export interface CollectionDomains {
  royaltyAggregationBagId: string
  royaltyStrategiesBagId: string
  tagsBagId: string
  symbol: string
  url: string
  name: string
  description: string
  tags: string[]

  royalties: {
    who: string
    bps: number
  }[]
}

// Requests

export interface WithIds {
  objectIds: string[]
}

export interface GetLaunchpadSlotParams {
  slotId: string
  resolveBags?: boolean
}

export interface GetInventoryParams {
  inventoryId: string
}

export interface GetLaunchpadParams {
  launchpadId: string
}

export interface GetNftsParams extends WithIds {
}

export interface GetCollectionsParams extends WithIds {
}

export interface GetCollectionDomainsParams {
  domainsBagId: string
}

export interface GetAuthoritiesParams extends WithIds {
}

export interface GetMarketsParams extends WithIds {

}
export interface GetNftCertificateParams extends WithIds {

}

/**
      return undefined;
       [
  {
    "status": "Exists",
    "details": {
      "data": {
        "dataType": "moveObject",
        "type": "0x2::dynamic_field::Field<0x2::dynamic_object_field::Wrapper<0x2::object::ID>, 0x2::object::ID>",
        "has_public_transfer": false,
        "fields": {
          "id": {
            "id": "0x18b181dacccb42d7169592a1155092ba95647b9a"
          },
          "name": {
            "type": "0x2::dynamic_object_field::Wrapper<0x2::object::ID>",
            "fields": {
              "name": "0x5bd796106a04cd7f9b938a0de088ecdf0b3f8040"
            }
          },
          "value": "0xbe5cb139ed4985d08a86c22302046434ab930ee9"
        }
      },
      "owner": {
        "ObjectOwner": "0xc0017c6694ec0b60ac4d29b4a9ddbcbe71b47b1d"
      },
      "previousTransaction": "75nSEAd6PmBcnBBzmYk5eyPGiFMR6fLkdV1djaTQuAnw",
      "storageRebate": 29,
      "reference": {
        "objectId": "0x18b181dacccb42d7169592a1155092ba95647b9a",
        "version": 377,
        "digest": "xhEASNLC4xWcvaMeBdv3JcE+DxhaKTWtlkFwJH90O4I="
      }
    }
  }
]
 *
 */

export type DynamicFieldRpcResponse = {
  id: ID
  name: {
    type: string
    fields: {
      name: string
    }
  },
  value: string
}

export type DynamicField = {
  value: string
}

export type BuildFixedPriceSlingshotParams = WithPackageObjectId & {
  collectionId: string
  admin: string,
  receiver: string,
  price: number,
}

export type BuildClaimNftParams = WithPackageObjectId & {
  nft: string
  launchpadId: string
  certificate: string
  recepient: string
}

export type BuildMintNftParams = WithPackageObjectId & {
  name: string
  description: string
  moduleName: string
  mintCap: string
  slot: string
  marketId: string
  // url: string
  // attributes: { [c: string]: string };
  // mintAuthority: string
  // launchpadId: string
  // tierIndex?: number
}

export type BuildBuyNftCertificateParams = WithPackageObjectId & {
  launchpadId: string
  slotId: string
  coin: string
  marketId: string
}

export interface BuildEnableSalesParams extends WithPackageObjectId {
  slotId: string
}

export type BuildClaimNftCertificateParams = WithPackageObjectId & {
  nftType: string
  certificateId: string
  slotId: string
  recepient: string
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

export type BuildCreateFlatFeeParams = WithPackageObjectId & {
  rate: number
}

export type BuildInitLaunchpadParams = WithPackageObjectId & {
  admin: string
  receiver: string
  autoApprove: boolean
  defaultFee: string // Flat fee address
}
export type BuildInitSlotParams = WithPackageObjectId & {
  launchpad: string
  slotAdmin: string
  receiver: string
}

export type BuildCreateFixedPriceMarket = WithPackageObjectId & {
  slot: string
  isWhitelisted: boolean // Define if the buyers need to be whitelisted
  price: number
  collectionType: string
}
