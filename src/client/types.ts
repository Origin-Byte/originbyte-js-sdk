/* eslint-disable camelcase */
import {
  GetObjectDataResponse,
  ObjectId,
  SuiAddress,
  SuiObject,
} from "@mysten/sui.js";

export interface GlobalParams {
  gasBudget?: number;
  moduleName?: string;
  packageObjectId?: ObjectId;
}

export interface WithPackageObjectId {
  packageObjectId: string;
}
export interface WithId {
  id: string;
}

export interface WithOwner {
  owner: string;
}

export interface ProtocolData extends WithPackageObjectId {
  packageModule: string;
  packageModuleClassName: string;
}

type ID = {
  id: string;
};

export interface NftCollectionRpcResponse {
  domains?: {
    type: string;
    fields: {
      id: ID;
      size: number;
    };
  };
  id: ID;
}

export interface MintCapRPCResponse {
  collection_id: string;
}

export interface FixedPriceMarketRpcResponse {
  price: number;
}

export interface DomainRpcBase<T> {
  id: ID;
  name: {
    type: string;
    fields: {
      dummy_field: boolean;
    };
  };
  value: {
    type: string;
    fields: T;
  };
}

export type ObjectBox = {
  type: string;
  fields: {
    id: ID;
    len: number;
  };
};

export type Bag = {
  type: string;
  fields: {
    id: ID;
    size: number;
  };
};

export type RoyaltyDomainRpcResponse = DomainRpcBase<{
  aggregations: Bag;
  strategies: Bag;
}>;

export type SymbolDomainRpcResponse = DomainRpcBase<{
  symbol: string;
}>;

export type UrlDomainRpcResponse = DomainRpcBase<{
  url: string;
}>;

export type DisplayDomainRpcResponse = DomainRpcBase<{
  description: string;
  name: string;
}>;

export type TagsDomainRpcResponse = DomainRpcBase<{
  bag: Bag;
}>;

export type TagRpcResponse = DomainRpcBase<{}>;

export type AttributionDomainRpcResponse = DomainRpcBase<{
  map: {
    type: string;
    fields: {
      contents: {
        type: string;
        fields: {
          key: string;
          value: string;
        };
      }[];
    };
  };
}>;

export interface DefaultFeeBoxRpcResponse {
  id: ID;
  name: {
    type: string;
    fields: {
      name: {
        type: string;
        fields: {
          name: string;
        };
      };
    };
  };
  value: string;
}

export interface ListingRpcResponse {
  marketplace_id?: {
    type: string;
    fields: {
      id: string;
    };
  };
  admin: string;
  receiver: string;
  inventories?: Bag;
  custom_fee: ObjectBox;
  proceeds: {
    fields: {
      id: ID;
      qt_sold: {
        fields: {
          collected: string;
          total: string;
        };
      };
    };
  };
}

export interface Listing extends WithPackageObjectId, WithId {
  admin: string;
  marketplace?: string;
  receiver: string;
  customFeeBagId: string;
  inventoriesBagId?: string;
  qtSold: number;
}

export interface FlatFeeRfcRpcResponse {
  id: ID;
  rate_bps: number;
}

export interface FlatFee {
  id: string;
  rateBps: number;
}

export interface WithRawResponse {
  rawResponse: GetObjectDataResponse;
}

export interface InventoryRpcResponse {
  live: {
    type: string;
    fields: {
      contents: {
        type: string;
        fields: {
          key: string;
          value: boolean;
        };
      }[];
    };
  };
  nfts_on_sale: string[];
}

export type Inventory = WithId & {
  nftsOnSale: string[];
  live: {
    market: string;
    live: boolean;
  }[];
};

export interface FixedPriceMarket extends WithRawResponse, WithId {
  price: number;
}

export interface MarketplaceRpcResponse {
  admin: string;
  default_fee: {
    type: string;
    fields: {
      id: ID;
      len: number;
    };
  };
  id: ID;
  permissioned: boolean;
  receiver: string;
}

export interface Marketplace
  extends WithId,
    WithPackageObjectId,
    WithRawResponse {
  owner: string;
  admin: string;
  receiver: string;
  defaultFeeBoxId: string;
}

export interface MintCap extends WithRawResponse, WithId {
  collectionId: string;
  // regulated: boolean
  // currentSupply: number
  // maxSupply: number
  // frozen: boolean
}

export interface ArtNftRpcResponse {
  logical_owner: string;
  bag?: Bag;
}

export interface NftCollection extends ProtocolData, WithId {
  domainsBagId: string;
  rawResponse: GetObjectDataResponse;
}

export interface ArtNftRaw extends ProtocolData, WithRawResponse, WithId {
  logicalOwner: string;
  bagId: string;
  ownerAddress: string;
}

export interface ArtNft extends ProtocolData, WithRawResponse, WithId {
  logicalOwner: string;
  name?: string;
  description?: string;
  url?: string;
  ownerAddress: string;
  attributes: { [c: string]: string };
}

export interface CollectionDomains {
  royaltyAggregationBagId: string;
  royaltyStrategiesBagId: string;
  tagsBagId: string;
  symbol: string;
  url: string;
  name: string;
  description: string;
  tags: string[];
  attributes: { [key: string]: string };

  royalties: {
    who: string;
    bps: number;
  }[];
}

// Requests

export interface WithIds {
  objectIds: string[];
}

export interface GetListingParams {
  listingId: string;
  resolveBags?: boolean;
}

export interface GetInventoryParams {
  inventoryId: string;
}

export interface GetMarketplaceParams {
  marketplaceId: string;
}

export interface GetNftsParams extends WithIds {}

export interface GetCollectionsParams extends WithIds {}

export interface GetCollectionDomainsParams {
  domainsBagId: string;
}

export interface GetAuthoritiesParams extends WithIds {}

export interface GetMarketsParams extends WithIds {}
export interface GetNftCertificateParams extends WithIds {}

export type DynamicFieldRpcResponse = {
  id: ID;
  name: {
    type: string;
    fields: {
      name: string;
    };
  };
  value: string;
};

export type DynamicField = {
  value: string;
};

export type BuildMintNftParams = WithPackageObjectId & {
  name: string;
  description: string;
  moduleName: string;
  mintCap: string;
  url: string;
  inventoryId: string;
  attributes: { [c: string]: string };
};

export type BuildBuyNftParams = WithPackageObjectId & {
  listing: string;
  inventory: string;
  market: string;
  coin: string;
  nftModuleName: string;
  nftClassName: string;
};

export interface BuildEnableSalesParams extends WithPackageObjectId {
  listing: string;
  inventory: string;
  market: string;
}

export type FetchFnParser<RpcResponse, DataModel> = (
  typedData: RpcResponse,
  suiObject: SuiObject,
  rpcResponse: GetObjectDataResponse
) => DataModel | undefined;

export interface SuiObjectParser<RpcResponse, DataModel> {
  parser: FetchFnParser<RpcResponse, DataModel>;
  regex: RegExp;
}

export interface CollectionParam {
  collection: string;
}

export interface SafeParam {
  safe: ObjectId;
}

export interface AuthParam {
  ownerCap: ObjectId;
}

export interface NftParam {
  nft: ObjectId;
}

export interface TransferCapParam {
  transferCap: ObjectId;
}

export interface FTParam {
  ft: string;
}

export interface OrderbookParam {
  orderbook: ObjectId;
}

export interface CommissionParams {
  beneficiary: SuiAddress;
  commission: number;
}

export interface PriceParam {
  price: number;
}

export interface WalletParam {
  wallet: ObjectId;
}

export interface SellerSafeParam {
  sellerSafe: ObjectId;
}

export interface BuyerSafeParam {
  buyerSafe: ObjectId;
}

export interface AllowlistParam {
  allowlist: ObjectId;
}

export interface TradeParam {
  trade: ObjectId;
}
export type BuildCreateFlatFeeParams = WithPackageObjectId & {
  rate: number;
};

export type BuildInitMarketplaceParams = WithPackageObjectId & {
  admin: string;
  receiver: string;
  defaultFee: string; // Flat fee address
};

export type BuildInitListingParams = WithPackageObjectId & {
  listingAdmin: string;
  receiver: string;
};

export type BuildCreateFixedPriceMarketParams = WithPackageObjectId & {
  price: number;
  coinType?: string; // SUI by default
};

export type BuildCreateFixedPriceMarketOnInventoryParams =
  BuildCreateFixedPriceMarketParams & {
    inventory: string;
    isWhitelisted: boolean;
  };

export type BuildCreateFixedPriceMarketOnListingParams =
  BuildCreateFixedPriceMarketOnInventoryParams & {
    listing: string;
  };

export type BuildRequestToJoinMarketplaceParams = WithPackageObjectId & {
  marketplace: string;
  listing: string;
};

export type BuildAcceptListingRequest = BuildRequestToJoinMarketplaceParams;

export type BuildInitInventoryParams = WithPackageObjectId & {};

export type BuildAddInventoryToListingParams = WithPackageObjectId & {
  listing: string;
  inventory: string;
};
