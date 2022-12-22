/* eslint-disable camelcase */
import {
  GetObjectDataResponse,
  ObjectId,
  ObjectOwner,
  SuiObject,
} from "@mysten/sui.js";

export interface GlobalParams {
  gasBudget?: number;
  moduleName?: string;
  packageObjectId: ObjectId;
}

export enum NftType {
  UNIQUE = "unique_nft::Unique",
}

export interface ProtocolData {
  packageObjectId: string;
  packageModule: string;
  packageModuleClassName: string;
}

export interface NftCollectionRpcResponse {
  name: string;
  description: string;
  symbol: string;
  receiver: string;
  royalty_fee_bps: number;
  mint_authority: string;
  creators: string;
  tags: {
    type: string;
    fields: {
      enumerations: {
        type: string;
        fields: {
          contents: {
            type: string;
            fields: {
              key: 0;
              value: string;
            };
          }[];
        };
      };
    };
  };
  metadata: {
    type: string;
    fields: {
      id: {
        id: string;
      };
      json: string;
    };
  };
}

export interface MintAuthorityRPCResponse {
  collection_id: string;
  supply_policy: {
    type: string;
    fields: {
      is_blind: boolean;
      supply: {
        type: string;
        fields: {
          current: number;
          frozen: boolean;
          max: number;
        };
      };
    };
  };
}

export interface FixedPriceMarketRpcResponse {
  admin: string;
  receiver: string;
  is_embedded: boolean;
  live: boolean;
  collection_id: string;
  sales: {
    type: string;
    fields: {
      id: {
        id: string;
      };
      market: {
        type: string;
        fields: {
          id: {
            id: string;
          };
          price: number;
        };
      };
      nfts: string[];
      queue: string;
      tier_index: number;
      whitelisted: boolean;
    };
  }[];
}

export interface FixedPriceMarket extends ProtocolData {
  admin: string;
  receiver: string;
  isEmbedded: boolean;
  collectionId: string;
  live: boolean;
  id: string;
  rawResponse: GetObjectDataResponse;
  sales: {
    marketPrice: number;
    nfts: string[];
    queue: string;
    tierIndex: number;
    whitelisted: boolean;
  }[];
}

export interface NftCertificateRpcResponse {
  nft_id: string;
  launchpad_id: string;
}

export interface NftCertificate {
  nftId: string;
  owner: string;
  id: string;
  packageObjectId: string;
  launchpadId: string;
  rawResponse: GetObjectDataResponse;
}

export interface MintAuthority {
  id: string;
  collectionId: string;
  isBlind: boolean;
  currentSupply: number;
  maxSupply: number;
  frozen: boolean;
  rawResponse: GetObjectDataResponse;
}

export interface ArtNftRpcResponse {
  type: string;
  data_id: string;
  // eslint-disable-next-line camelcase
  data: {
    type: string;
    fields: {
      attributes: {
        type: string;
        fields: {
          keys: string[];
          values: string[];
        };
      };
      collection_id: string;
      description: string;
      id: {
        id: string;
      };
      name: string;
      url: string;
    };
  };
}

export interface NftCollection extends ProtocolData {
  name: string;
  description: string;
  creators: string;
  symbol: string;
  // currentSupply: number
  // totalSupply: number
  receiver: string;
  mintAuthorityId: string;
  type: string;
  id: string;
  tags: string[];
  rawResponse: GetObjectDataResponse;
}

export interface ArtNft extends ProtocolData {
  name: string;
  attributes: { [c: string]: string };
  collectionId: string;
  url: string;
  ownerAddress: string;
  owner: ObjectOwner;
  type: string;
  id: string;
  rawResponse: GetObjectDataResponse;

  nftType: NftType;
}

export interface ArtNftWithCollection {
  data: ArtNft;
  collection: NftCollection;
}

export interface WithIds {
  objectIds: string[];
}

export interface GetNftsParams extends WithIds {}

export interface GetCollectionsParams extends WithIds {
  resolveAuthorities?: boolean;
}

export interface GetAuthoritiesParams extends WithIds {}

export interface GetMarketsParams extends WithIds {}
export interface GetNftCertificateParams extends WithIds {}

export interface BuildFixedPriceSlingshotParams {
  collectionId: string;
  packageObjectId: string;
  admin: string;
  receiver: string;
  price: number;
}

export interface BuildClaimNftParams {
  nft: string;
  launchpadId: string;
  certificate: string;
  recepient: string;
  packageObjectId: string;
}

export interface BuildMintNftParams {
  name: string;
  description: string;
  moduleName: string;
  url: string;
  attributes: { [c: string]: string };
  mintAuthority: string;
  packageObjectId: string;
  launchpadId: string;
  tierIndex?: number;
}

export interface BuildBuyNftCertificateParams {
  wallet: string; // Coin to pay
  launchpadId: string;
  tierIndex?: number;
  packageObjectId: string;
  collectionType: string;
}

export interface BuildEnableSalesParams {
  packageObjectId: string;
  launchpadId: string;
  collectionType: string;
}

export interface BuildClaimNftCertificateParams {
  launchpadId: string;
  nftId: string;
  certificateId: string;
  recepient: string;
  packageObjectId: string;
  collectionType: string;
  nftType: NftType;
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
