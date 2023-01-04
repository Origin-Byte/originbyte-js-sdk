/* eslint-disable camelcase */
import {
  GetObjectDataResponse, SuiObject,
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
  custom_fee: ObjectBox
  inventories: Bag
  launchpad_id: string
  live: boolean
  markets: Bag
  proceeds: {
    fields: {
      id: ID
      qt_sold: {
        fields: {
          collected: string
          total: string
        }
      }
    }
  }
  receiver: string
}

export interface LaunchpadSlot extends WithPackageObjectId, WithId {
  admin: string
  launchpad: string
  receiver: string
  customFeeBagId: string
  inventoriesBagId: string
  marketsBagId: string
  live: boolean
  qtSold: number
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
  queue: string[]
  nfts_on_sale: string[]
}

export interface Inventory extends Omit<InventoryRpcResponse, 'nfts_on_sale'>, WithId {
  nftsOnSale: string[]
}

export interface FixedPriceMarket extends WithRawResponse, WithId {
  price: number
}

export interface NftCertificateRpcResponse {
  nft_id: string
  launchpad_id: string
  slot_id: string
}

export interface NftCertificate extends WithRawResponse, WithId {
  nftId: string
  owner: string
  packageObjectId: string
  launchpadId: string
  slotId: string
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
  // regulated: boolean
  // currentSupply: number
  // maxSupply: number
  // frozen: boolean
}

export interface ArtNftRpcResponse {
  logical_owner: string
  bag: Bag
}

export interface NftCollection extends ProtocolData, WithId {
  domainsBagId: string
  rawResponse: GetObjectDataResponse
}

export interface ArtNftRaw extends ProtocolData, WithRawResponse, WithId {
  logicalOwner: string
  bagId: string
}

export interface ArtNft extends ProtocolData, WithRawResponse, WithId {
  logicalOwner: string
  name?: string
  description?: string
  url?: string
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

export type BuildMintNftParams = WithPackageObjectId & {
  name: string
  description: string
  moduleName: string
  mintCap: string
  url: string
  inventoryId: string
  attributes: { [c: string]: string };
  // mintAuthority: string
  // launchpadId: string
  // tierIndex?: number
}

export type BuildBuyNftParams = WithPackageObjectId & {
  slotId: string
  coin: string
  marketId: string
  nftType: string
}

export interface BuildEnableSalesParams extends WithPackageObjectId {
  slotId: string
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

export type BuildCreateFixedPriceMarketParams = WithPackageObjectId & {
  slot: string
  isWhitelisted: boolean // Define if the buyers need to be whitelisted
  price: number
}

export type BuildCreateFixedPriceMarketWithInventoryParams = Omit<BuildCreateFixedPriceMarketParams, 'isWhitelisted'> & {
  inventoryId: string
}

export type BuildCreateInventoryParams = WithPackageObjectId & {
  isWhitelisted: boolean // Define if the buyers need to be whitelisted
}
