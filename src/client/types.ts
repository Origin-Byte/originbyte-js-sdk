/* eslint-disable camelcase */
import {
  JsonRpcProvider,
  ObjectId,
  SuiAddress,
  SuiObjectResponse,
  TransactionBlock,
} from "@mysten/sui.js";
import { TransactionResult } from "../transaction";

export interface WithPackageObjectId {
  packageObjectId: ObjectId;
  transaction?: TransactionBlock;
}

export type WithNftType = {
  nftType: string;
};

export interface WithId {
  id: string;
}

export interface WithOwner {
  owner: string;
}

export type EmptyRpcResponse = {};
export type EmptyModel = WithPackageObjectId & WithOwner & WithId & {};

export type TransactionParams = {
  transaction?: TransactionBlock;
}

export interface GlobalParams extends Partial<WithPackageObjectId>, TransactionParams {
  packageObjectId?: string;
  moduleName?: string;
}

export type WithCollectionPackageId = {
  collectionPackageId?: string;
};

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

export type VenueRpcResponse = {
  is_live: boolean;
  is_whitelisted: boolean;
};

export type MarketAbstractRpcResponse<T = {}> = {
  id: ID;
  name: {
    type: string;
    fields: {
      dummy_field: boolean;
    };
  };
  value: {
    type: string;
    fields: T & {
      id: ID;
      inventory_id: string;
      price: string;
    };
  };
};

export type FixedPriceMarketRpcResponse = MarketAbstractRpcResponse;
export type LimitedFixedPriceMarketpcResponse = MarketAbstractRpcResponse<{
  limit: string;
  addresses: Record<string, string>;
}>;

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

export type RoyaltyDomain = {
  value: {
    fields: {
      aggregations: {
        id: string;
      };
      royalty_shares_bps: {
        fields: {
          contents: {
            fields: {
              key: string;
              value: number;
            };
          }[];
        };
      };
      strategies: {
        id: string;
      };
    };
  };
};

export type RoyaltyDomainBagRpcResponse = RoyaltyDomain;
export type RoyaltyDomainRpcResponse = DomainRpcBase<RoyaltyDomain>;

export type SymbolDomain = {
  symbol: string;
};

export type SymbolDomainBagRpcResponse = DomainRpcBase<SymbolDomain>;

export type UrlDomain = {
  url: string;
};

export type UrlDomainBagRpcResponse = DomainRpcBase<UrlDomain>;

export type DisplayDomain = {
  description: string;
  name: string;
};

export type DisplayDomainBagRpcResponse = DomainRpcBase<DisplayDomain>;

export type TagsDomain = {
  id: ID;
  name: {
    type: string;
    fields: { dummy_field: boolean };
  };
  value: {
    type: string;
    fields: {
      id: ID;
    };
  };
};

export type TagsDomainBagRpcResponse = DomainRpcBase<TagsDomain>;

export type TagRpcResponse = DomainRpcBase<{}>;

export type AttributionDomain = {
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
};

export type AttributionDomainBagRpcResponse = DomainRpcBase<AttributionDomain>;

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
  venues: ObjectBox;
  inventories: ObjectBox;
  custom_fee: ObjectBox;
}

export interface Listing extends WithPackageObjectId, WithId {
  admin: string;
  marketplace?: string;
  receiver: string;
  customFeeBagId: string;
  inventoriesBagId?: string;
  venuesBagId?: string;
  qtSold: number;
  rawResponse: SuiObjectResponse;
}

export interface FlatFeeRfcRpcResponse {
  id: ID;
  rate_bps: number;
}

export type FlatFee = WithPackageObjectId & {
  id: string;
  rateBps: number;
};

export interface WithRawResponse {
  rawResponse: SuiObjectResponse;
}

export type WarehouseRpcResponse = {};

export type Warehouse = WithId & {};

export type InventoryRpcResponse = {
  allowlist: {};
};

export type Inventory = EmptyModel &
  WithRawResponse &
  ProtocolData & {
    collectionContractPackageId: string;
    nftType: string;
  };

export type InventoryDofRpcResponse = {
  id: ID;
  name: {
    type: string;
    fields: {
      dummy_field: boolean;
    };
  };
  value: {
    type: string;
    fields: {
      id: ID;
      nfts: string[];
    };
  };
};

export type InventoryContent = WithId & {
  nfts: string[];
};

export type Venue = WithRawResponse &
  WithPackageObjectId &
  WithId & {
    isLive: boolean;
    isWhitelisted: boolean;
  };

export interface FixedPriceMarket
  extends WithRawResponse,
  WithId,
  WithPackageObjectId {
  price: string;
  inventoryId: string;
  marketType: "fixed_price" | "limited_fixed_price";
}

export type LimitedFixedPriceMarket = FixedPriceMarket & {
  limit: number;
  addresses: Map<string, number>;
};

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

export interface MintCap extends WithRawResponse, EmptyModel {
  collectionId: string;
}

export interface ArtNftRpcResponse {
  logical_owner: string;
  name?: string;
  url?: string;
  bag?: Bag;
}

export interface NftCollection extends WithId {
  domainsBagId: string;
  rawResponse: SuiObjectResponse;
  collectionNftType: string;
  nftProtocolPackageObjectId: string;
}

interface ArtNftFull extends ProtocolData, WithRawResponse, WithId {
  attributes: { [c: string]: string }
  logicalOwner: string;
  collectionPackageObjectId: string;
  bagId?: string;
  ownerAddress: string;
  name?: string;
  description?: string;
  url?: string;
}

export type ArtNftRaw = Omit<ArtNftFull, "packageObjectId">;

export type ArtNft = ArtNftRaw & {
  description?: string;
  attributes: { [c: string]: string };
}

export interface CollectionDomains {
  symbol: string;
  url: string;
  name: string;
  description: string;
  tags: string[];
  attributes: { [key: string]: string };
  tagsBagId: string;
  royaltyStrategies: string[];
}

// Requests

export interface WithIds {
  objectIds: string[];
}

export interface GetListingParams {
  listingId: string;
  resolveBags?: boolean;
}

export interface GetWarehouseParams {
  warehouseId: string;
}

export interface GetInventoryParams {
  inventoryId: string;
}

export interface GetMarketplaceParams {
  marketplaceId: string;
}

export interface GetNftsParams extends WithIds {
  resolveBags?: boolean;
}

export interface GetCollectionsParams extends WithIds { }

export interface GetCollectionDomainsParams {
  domainsBagId: string;
}

export interface GetMintCapsParams extends WithIds { }

export interface GetVenuesParams extends WithIds { }

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

export type BuildMintNftParams = GlobalParams & {
  name: string;
  description: string;
  moduleName: string;
  mintCap: string;
  url: string;
  warehouseId: string;
  attributes: { [c: string]: string };
};

export type NftModuleParams = {
  nftModuleName: string;
  nftClassName: string;
};

export type BuildBuyNftParams = GlobalParams &
  WithCollectionPackageId &
  WithNftType & {
    listing: string;
    venue: string;
    coin: string | TransactionResult;
    module?: "fixed_price" | "limited_fixed_price";
    coinType?: string;
  };

export type BuildBuyWhitelistedNftParams = BuildBuyNftParams & {
  whitelistCertificate: string;
};

export interface BuildEnableSalesParams extends WithPackageObjectId {
  listing: string;
  venue: string;
}

export type FetchFnParser<DataModel> = (
  data: SuiObjectResponse
) => DataModel | undefined;

export interface SuiObjectParser<DataModel> {
  parser: FetchFnParser<DataModel>;
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

export interface NftsParam {
  nfts: ObjectId[];
}

export interface NftTypeParam {
  nftType: string;
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

export interface CommissionsParams {
  beneficiary: SuiAddress;
  commissions: number[];
}

export interface PriceParam {
  price: number;
}

export interface PricesParam {
  prices: number[];
}

export interface OldPriceParam {
  oldPrice: number;
}

export interface NewPriceParam {
  newPrice: number;
}

export interface WalletParam {
  wallet: ObjectId | TransactionResult;
}

export interface KioskParam {
  kiosk: ObjectId | TransactionResult;
}

export interface SellerSafeParam {
  sellerSafe: ObjectId;
}

export interface BuyerSafeParam {
  buyerSafe: ObjectId;
}

export interface BuyersKioskParam {
  buyersKiosk: ObjectId | TransactionResult;
}

export interface SellersKioskParam {
  sellersKiosk: ObjectId | TransactionResult;
}

export interface AllowlistParam {
  allowlist: ObjectId;
}

export interface TradeParam {
  trade: ObjectId;
}

export interface BidParam {
  bid: string;
}

export type BuildCreateFlatFeeParams = WithPackageObjectId & {
  rate: number;
};

export type BuildInitMarketplaceParams = WithPackageObjectId & {
  admin: string;
  receiver: string;
  defaultFee: string; // Flat fee address
  feeType?: string;
};

export type BuildInitListingParams = WithPackageObjectId & {
  listingAdmin: string;
  receiver: string;
};

export type BuildCreateFixedPriceMarketParams = WithPackageObjectId & {
  price: number;
  coinType?: string; // SUI by default
  inventory: string;
};

export type BuildInitVenueParams = BuildCreateFixedPriceMarketParams &
  WithNftType & {
    listing: string;
    isWhitelisted: boolean;
  };

export type BuildInitLimitedVenueParams = BuildInitVenueParams & {
  limit: number;
};

export type BuildSetLimitMarketLimitParams = WithPackageObjectId & {
  coinType?: string; // SUI by default
  listing: string;
  venue: string;
  newLimit: number;
};

export type BuildRequestToJoinMarketplaceParams = WithPackageObjectId & {
  marketplace: string;
  listing: string;
};

export type BuildAcceptListingRequest = BuildRequestToJoinMarketplaceParams;

export type BuildInitWarehouseParams = WithPackageObjectId &
  WithCollectionPackageId &
  WithNftType;

export type BuildAddWarehouseToListingParams = WithPackageObjectId &
  WithCollectionPackageId &
  WithNftType & {
    listing: string;
    warehouse: string;
  };

export type VenueWithMarket = Venue & {
  market: FixedPriceMarket | LimitedFixedPriceMarket;
};

export type BuildIsueWhitelistCertificateParams = WithPackageObjectId & {
  listing: string;
  venue: string;
  recipient: string;
};

export type BuildSetMarketPriceParams = WithPackageObjectId & {
  listing: string;
  venue: string;
  price: number;
  module?: "fixed_price" | "limited_fixed_price";
  coinType?: string;
};

export type BuildProceedFeesParams = WithPackageObjectId & {
  listing: string;
  marketplace: string;
  coinType?: string;
};

export type BuildDistributeRoyaltiesParams = WithPackageObjectId & {
  nftType: string;
  coinType?: string;
  collection: string | TransactionResult;
}

export type BuildCollectRoyaltiesParams = BuildDistributeRoyaltiesParams & {

  royaltyStrategy: string | TransactionResult;
}
export type ArrElement<ArrType> = ArrType extends readonly (infer ElementType)[] ? ElementType : never;

export type DynFieldArrPromise = ReturnType<JsonRpcProvider["getDynamicFields"]>;
export type DynFieldArr = Awaited<DynFieldArrPromise>;
export type DynField = ArrElement<DynFieldArr["data"]>;
