import { JsonRpcProvider } from "@mysten/sui.js";
import {
  buildBuyNftCertificate,
  buildMintNftTx,
  buildEnableSales,
  buildClaimNftCertificate,
} from "./txBuilders";
import { toMap, uniq } from "../utils";
import {
  ArtNftParser,
  CollectionParser,
  FixedPriceMarketParser,
  MintAuthorityParser,
  NftCertificateParser,
} from "./parsers";
import {
  GetAuthoritiesParams,
  ArtNftWithCollection,
  GetCollectionsParams,
  GetNftsParams,
  SuiObjectParser,
  MintAuthority,
  NftCollection,
  GetNftCertificateParams,
  GetMarketsParams,
} from "./types";
import { isObjectExists } from "./utils";

const TESTNET_URL = "https://fullnode.devnet.sui.io";

export class NftClient {
  private provider: JsonRpcProvider;

  constructor(_provider = new JsonRpcProvider(TESTNET_URL)) {
    this.provider = _provider;
  }

  private fetchObjectIdsForAddress = async <RpcResponse, DataModel>(
    address: string,
    parser: SuiObjectParser<RpcResponse, DataModel>
  ): Promise<string[]> => {
    const objectsForWallet = await this.provider.getObjectsOwnedByAddress(
      address
    );
    return objectsForWallet
      .filter((_) => _.type.match(parser.regex))
      .map((_) => _.objectId);
  };

  fetchAndParseObjectsById = async <RpcResponse, DataModel>(
    ids: string[],
    parser: SuiObjectParser<RpcResponse, DataModel>
  ): Promise<DataModel[]> => {
    const objects = await this.provider.getObjectBatch(ids);

    const parsedObjects = objects
      .filter(isObjectExists)
      .map((_) => {
        if (
          typeof _.details === "object" &&
          "data" in _.details &&
          "fields" in _.details.data &&
          _.details.data.type.match(parser.regex)
        ) {
          return parser.parser(
            _.details.data.fields as RpcResponse,
            _.details,
            _
          );
        }
        return undefined;
      })
      .filter((_): _ is DataModel => !!_);

    return parsedObjects;
  };

  fetchAndParseObjectsForAddress = async <RpcResponse, DataModel>(
    address: string,
    parser: SuiObjectParser<RpcResponse, DataModel>
  ) => {
    const objectIds = await this.fetchObjectIdsForAddress(address, parser);
    return this.fetchAndParseObjectsById(objectIds, parser);
  };

  getMintAuthoritiesById = async (params: GetAuthoritiesParams) => {
    return this.fetchAndParseObjectsById(params.objectIds, MintAuthorityParser);
  };

  getMarketsByParams = async (params: GetMarketsParams) => {
    const markets = await this.fetchAndParseObjectsById(
      params.objectIds,
      FixedPriceMarketParser
    );
    const collectionIds = uniq(markets.map((_) => _.collectionId));
    const collections = await this.getCollectionsById({
      objectIds: collectionIds,
    });
    const collectionsMap = toMap(collections, (_) => _.id);
    return markets.map((market) => ({
      data: market,
      collection: collectionsMap.get(market.collectionId),
    }));
  };

  getCollectionsById = async (params: GetCollectionsParams) => {
    const collections = await this.fetchAndParseObjectsById(
      params.objectIds,
      CollectionParser
    );
    if (!params.resolveAuthorities) {
      return collections;
    }
    const authoritiesId = collections.map((_) => _.mintAuthorityId);
    const authorities = await this.getMintAuthoritiesById({
      objectIds: authoritiesId,
    });
    return this.mergeAuthoritiesWithCollections(collections, authorities);
  };

  getCollectionsForAddress = async (address: string) => {
    // Since collectiona are shared object, we have to fetch MintAuthorities first
    const authoritiesIds = await this.fetchObjectIdsForAddress(
      address,
      MintAuthorityParser
    );
    if (!authoritiesIds.length) {
      return [];
    }
    const authorities = await this.getMintAuthoritiesById({
      objectIds: authoritiesIds,
    });
    const collectionIds = authorities.map((_) => _.collectionId);
    const collections = await this.getCollectionsById({
      objectIds: collectionIds,
      resolveAuthorities: false,
    });

    return this.mergeAuthoritiesWithCollections(collections, authorities);
  };

  getNftsById = async (
    params: GetNftsParams
  ): Promise<ArtNftWithCollection[]> => {
    const nfts = await this.fetchAndParseObjectsById(
      params.objectIds,
      ArtNftParser
    );
    const collectionIds = nfts.map((_) => _.collectionId);
    const collections = await this.getCollectionsById({
      objectIds: collectionIds,
      resolveAuthorities: true,
    });
    const collectionById = toMap(collections, (_) => _.id);

    return nfts.map((nft) => {
      const collection = collectionById.get(nft.collectionId);
      return {
        data: nft,
        collection,
      };
    });
  };

  getNftsForAddress = async (address: string) => {
    const objectIds = await this.fetchObjectIdsForAddress(
      address,
      ArtNftParser
    );
    return this.getNftsById({ objectIds });
  };

  getNftCertificatesById = async (params: GetNftCertificateParams) => {
    const certificates = await this.fetchAndParseObjectsById(
      params.objectIds,
      NftCertificateParser
    );
    const nftIds = uniq(certificates.map((_) => _.nftId));
    const nfts = await this.getNftsById({ objectIds: nftIds });
    const nftsMap = toMap(nfts, (_) => _.data.id);
    return certificates.map((certificate) => ({
      data: certificate,
      nft: nftsMap.get(certificate.nftId),
    }));
  };

  getNftCertificatesForAddress = async (address: string) => {
    const objectIds = await this.fetchObjectIdsForAddress(
      address,
      NftCertificateParser
    );
    return this.getNftCertificatesById({ objectIds });
  };

  static buildMintNftTx = buildMintNftTx;

  static buildBuyNftCertificate = buildBuyNftCertificate;

  static buildEnableSales = buildEnableSales;

  static buildClaimNftCertificate = buildClaimNftCertificate;

  private mergeAuthoritiesWithCollections = (
    collections: NftCollection[],
    authorities: MintAuthority[]
  ) => {
    const collectionsMap = toMap(collections, (_) => _.id);
    return authorities.map((mintAuthority) => ({
      ...collectionsMap.get(mintAuthority.collectionId),
      mintAuthority,
    }));
  };
}
