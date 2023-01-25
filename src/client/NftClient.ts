import {
  GetObjectDataResponse,
  is,
  SuiObject,
  JsonRpcProvider,
} from "@mysten/sui.js";
import {
  buildBuyNft,
  biuldMintNft,
  buildEnableSales,
  buildCreateFlatFee,
  buildCreateFixedPriceMarketOnInventory,
  buildInitMarketplace,
  buildInitListing,
  buildInitFixedPriceMarket,
  buildInitInventoryTx,
  buildCreateFixedPriceMarketOnListing,
  buildRequestToJoinMarketplace,
  buildAcceptListingRequest,
  buildAddInventoryToListing,
} from "./txBuilders";
import { toMap } from "../utils";
import {
  MarketplaceParser,
  ArtNftParser,
  CollectionParser,
  FixedPriceMarketParser,
  MintCapParser,
  parseDomains,
  parseTags,
  FlatFeeParser,
  ListingParser,
  DynamicFieldParser,
  InventoryParser,
  MoveObject,
} from "./parsers";
import {
  GetAuthoritiesParams,
  GetCollectionsParams,
  GetNftsParams,
  SuiObjectParser,
  MintCap,
  NftCollection,
  GetMarketsParams,
  GetMarketplaceParams,
  GetCollectionDomainsParams,
  DefaultFeeBoxRpcResponse,
  GetInventoryParams,
  GetListingParams,
  ArtNft,
} from "./types";
import { isObjectExists } from "./utils";
import { TESTNET_URL } from "./consts";

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

  parseObjects = async <RpcResponse, DataModel>(
    objects: GetObjectDataResponse[],
    parser: SuiObjectParser<RpcResponse, DataModel>
  ): Promise<DataModel[]> => {
    const parsedObjects = objects
      .filter(isObjectExists)
      .map((_) => {
        if (
          is(_.details, SuiObject) &&
          is(_.details.data, MoveObject) &&
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

  fetchAndParseObjectsById = async <RpcResponse, DataModel>(
    ids: string[],
    parser: SuiObjectParser<RpcResponse, DataModel>
  ): Promise<DataModel[]> => {
    if (ids.length === 0) {
      return [];
    }
    const objects = await this.provider.getObjectBatch(ids);
    return this.parseObjects(objects, parser);
  };

  fetchAndParseObjectsForAddress = async <RpcResponse, DataModel>(
    address: string,
    parser: SuiObjectParser<RpcResponse, DataModel>
  ) => {
    const objectIds = await this.fetchObjectIdsForAddress(address, parser);
    return this.fetchAndParseObjectsById(objectIds, parser);
  };

  getMintCapsById = async (params: GetAuthoritiesParams) => {
    return this.fetchAndParseObjectsById(params.objectIds, MintCapParser);
  };

  getMarketsByParams = async (params: GetMarketsParams) => {
    return this.fetchAndParseObjectsById(
      params.objectIds,
      FixedPriceMarketParser
    );
  };

  getCollectionsById = async (params: GetCollectionsParams) => {
    return this.fetchAndParseObjectsById(params.objectIds, CollectionParser);
  };

  getBagContent = async (bagId: string) => {
    const bagObjects = await this.provider.getObjectsOwnedByObject(bagId);
    const objectIds = bagObjects.map((_) => _.objectId);
    return this.provider.getObjectBatch(objectIds);
  };

  getAndParseBagContent = async <RpcResponse, DataModel>(
    bagId: string,
    parser: SuiObjectParser<RpcResponse, DataModel>
  ) => {
    const bagObjects = await this.getBagContent(bagId);
    return this.parseObjects(bagObjects, parser);
  };

  getCollectionDomains = async (params: GetCollectionDomainsParams) => {
    const domains = await this.getBagContent(params.domainsBagId);

    const parsedDomains = parseDomains(domains);

    if (parsedDomains.tagsBagId) {
      const t = await this.getBagContent(parsedDomains.tagsBagId);
      parsedDomains.tags = parseTags(t);
    }
    return parsedDomains;
  };

  getCollectionsForAddress = async (address: string) => {
    // Since collections are shared object, we have to fetch MintCaps first
    const authoritiesIds = await this.fetchObjectIdsForAddress(
      address,
      MintCapParser
    );
    if (!authoritiesIds.length) {
      return [];
    }
    const authorities = await this.getMintCapsById({
      objectIds: authoritiesIds,
    });
    const collectionIds = authorities.map((_) => _.collectionId);
    const collections = await this.getCollectionsById({
      objectIds: collectionIds,
    });

    return this.mergeAuthoritiesWithCollections(collections, authorities);
  };

  getMarketplaceById = async (params: GetMarketplaceParams) => {
    const marketplaces = await this.fetchAndParseObjectsById(
      [params.marketplaceId],
      MarketplaceParser
    );

    if (!marketplaces.length) {
      return undefined;
    }
    const marketplace = marketplaces[0];
    const fees = await this.getBagContent(marketplace.defaultFeeBoxId);

    if (!fees.length) {
      return marketplace;
    }
    const fee = fees[0];
    if (is(fee.details, SuiObject) && is(fee.details.data, MoveObject)) {
      const feeBox = fee.details.data.fields as DefaultFeeBoxRpcResponse;
      const feeData = await this.fetchAndParseObjectsById(
        [feeBox.value],
        FlatFeeParser
      );

      if (feeData.length) {
        return { ...marketplace, defaultFee: feeData[0] };
      }
    }
    return marketplace;
  };

  getListingById = async (params: GetListingParams) => {
    const listings = await this.fetchAndParseObjectsById(
      [params.listingId],
      ListingParser
    );
    if (!listings.length) {
      return undefined;
    }

    const listing = listings[0];

    if (!params.resolveBags || !listing.inventoriesBagId) {
      return listing;
    }
    const [[inventories]] = await Promise.all([
      this.getAndParseBagContent(listing.inventoriesBagId, DynamicFieldParser),
    ]);
    return {
      ...listing,
      inventoriesId: inventories?.value,
    };
  };

  getInventoriesById = async (params: GetInventoryParams) => {
    return this.fetchAndParseObjectsById([params.inventoryId], InventoryParser);
  };

  getNftsById = async (params: GetNftsParams): Promise<ArtNft[]> => {
    const nfts = await this.fetchAndParseObjectsById(
      params.objectIds,
      ArtNftParser
    );
    const bags = await Promise.all(
      nfts.filter((_) => !!_.bagId).map(async (_) => {
        const content = await this.getBagContent(_.bagId);
        return {
          nftId: _.id,
          content: parseDomains(content),
        };
      })
    );
    const bagsByNftId = toMap(bags, (_) => _.nftId);

    return nfts.map((nft) => {
      const fields = bagsByNftId.get(nft.id);
      return {
        logicalOwner: nft.logicalOwner,
        name: fields?.content.name,
        description: fields?.content.description,
        url: fields?.content.url,
        attributes: fields?.content.attributes,
        packageModule: nft.packageModule,
        packageObjectId: nft.packageObjectId,
        packageModuleClassName: nft.packageModuleClassName,
        id: nft.id,
        rawResponse: nft.rawResponse,
        ownerAddress: nft.ownerAddress,
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

  static biuldMintNft = biuldMintNft;

  static buildBuyNft = buildBuyNft;

  static buildEnableSales = buildEnableSales;

  static buildCreateFlatFee = buildCreateFlatFee;

  static buildCreateFixedPriceMarketOnInventory =
    buildCreateFixedPriceMarketOnInventory;

  static buildCreateFixedPriceMarketOnListing =
    buildCreateFixedPriceMarketOnListing;

  static buildInitFixedPriceMarket = buildInitFixedPriceMarket;

  static buildInitMarketplace = buildInitMarketplace;

  static buildInitInventory = buildInitInventoryTx;

  static buildInitListing = buildInitListing;

  static buildRequestToJoinMarketplace = buildRequestToJoinMarketplace;

  static buildAcceptListingRequest = buildAcceptListingRequest;

  static buildAddInventoryToListing = buildAddInventoryToListing;

  private mergeAuthoritiesWithCollections = (
    collections: NftCollection[],
    caps: MintCap[]
  ) => {
    const collectionsMap = toMap(collections, (_) => _.id);
    return caps.map((mintCap) => ({
      ...collectionsMap.get(mintCap.collectionId),
      mintCap,
    }));
  };
}
