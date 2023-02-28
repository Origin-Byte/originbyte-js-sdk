import {
  GetObjectDataResponse,
  is,
  SuiObject,
  JsonRpcProvider,
  Connection,
} from "@mysten/sui.js";
import {
  buildBuyNftTx,
  biuldMintNftTx,
  buildEnableSalesTx,
  buildCreateFlatFeeTx,
  buildInitMarketplaceTx,
  buildInitListingTx,
  buildInitWarehouseTx,
  buildInitVenueTx,
  buildRequestToJoinMarketplaceTx,
  buildAcceptListingRequestTx,
  buildAddWarehouseToListingTx,
  buildInitLimitedVenueTx,
  buildSetLimtitedMarketNewLimitTx,
} from "./txBuilders";
import { toMap } from "../utils";
import {
  MarketplaceParser,
  ArtNftParser,
  CollectionParser,
  VenueParser,
  MintCapParser,
  parseBagDomains,
  parseTags,
  FlatFeeParser,
  ListingParser,
  WarehouseParser,
  MoveObject,
  parseDynamicDomains,
  FixedPriceMarketParser,
  InventoryParser,
  InventoryDofParser,
  LimitedFixedPriceMarketParser,
} from "./parsers";
import {
  GetMintCapsParams,
  GetCollectionsParams,
  GetNftsParams,
  SuiObjectParser,
  MintCap,
  NftCollection,
  GetVenuesParams,
  GetMarketplaceParams,
  GetCollectionDomainsParams,
  DefaultFeeBoxRpcResponse,
  GetWarehouseParams,
  GetListingParams,
  ArtNft,
  VenueWithMarket,
  GetInventoryParams,
} from "./types";
import { isObjectExists } from "./utils";
import { TESTNET_URL } from "./consts";

export class NftClient {
  private provider: JsonRpcProvider;

  constructor(
    _provider = new JsonRpcProvider(new Connection({ fullnode: TESTNET_URL }))
  ) {
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
      .map(({ objectId }) => objectId);
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

  getMintCapsById = async (params: GetMintCapsParams) => {
    return this.fetchAndParseObjectsById(params.objectIds, MintCapParser);
  };

  getVenuesByParams = async (params: GetVenuesParams) => {
    const venues = await this.fetchAndParseObjectsById(
      params.objectIds,
      VenueParser
    );

    const venueWithMarket = await Promise.all(
      venues.map(async (venue) => {
        const marketResponse = await this.getDynamicFields(venue.id);
        const parsed = await Promise.all([
          this.parseObjects(marketResponse, FixedPriceMarketParser),
          this.parseObjects(marketResponse, LimitedFixedPriceMarketParser),
        ]);
        const market = parsed.flat().find((m) => !!m);

        if (market) {
          return {
            ...venue,
            market,
          } as VenueWithMarket;
        }
        return undefined;
      })
    );

    return venueWithMarket.filter((_): _ is VenueWithMarket => !!_);
  };

  getCollectionsById = async (params: GetCollectionsParams) => {
    return this.fetchAndParseObjectsById(params.objectIds, CollectionParser);
  };

  getDynamicFields = async (parentdId: string) => {
    const objects = await this.provider.getDynamicFields(parentdId);
    const objectIds = objects.data.map((_) => _.objectId);
    return this.provider.getObjectBatch(objectIds);
  };

  getBagContent = async (bagId: string) => {
    const bagObjects = await this.provider.getDynamicFields(bagId);
    let objectIds: string[];
    if (Array.isArray(bagObjects)) {
      objectIds = bagObjects.map(({ objectId }) => objectId);
    } else {
      objectIds = bagObjects.data.map(({ objectId }) => objectId);
    }
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

    const parsedDomains = parseBagDomains(domains);

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
    const [[inventory]] = await Promise.all([
      this.getAndParseBagContent(listing.inventoriesBagId, InventoryParser),
    ]);
    return {
      ...listing,
      inventoryId: inventory?.id,
    };
  };

  getWarehousesById = async (params: GetWarehouseParams) => {
    return this.fetchAndParseObjectsById([params.warehouseId], WarehouseParser);
  };

  getInventoryById = async (params: GetInventoryParams) => {
    const [inventory] = await this.fetchAndParseObjectsById(
      [params.inventoryId],
      InventoryParser
    );
    const fields = await this.getDynamicFields(params.inventoryId);
    const [parsedFields] = await this.parseObjects(fields, InventoryDofParser);

    return {
      id: inventory.id,
      nfts: parsedFields.nfts,
    };
  };

  getNftsById = async (params: GetNftsParams): Promise<ArtNft[]> => {
    const { resolveBags = true } = params;
    const nfts = await this.fetchAndParseObjectsById(
      params.objectIds,
      ArtNftParser
    );

    const bags = resolveBags
      ? await Promise.all(
          nfts.map(async (_) => {
            const content = _.bagId
              ? await this.getBagContent(_.bagId)
              : await this.getDynamicFields(_.id);

            return {
              nftId: _.id,
              content: _.bagId
                ? parseBagDomains(content)
                : parseDynamicDomains(content),
            };
          })
        )
      : [];
    const bagsByNftId = toMap(bags, (_) => _.nftId);

    return nfts.map((nft) => {
      const fields = bagsByNftId.get(nft.id);
      return {
        logicalOwner: nft.logicalOwner,
        name: fields?.content.name ?? nft.name,
        description: fields?.content.description ?? "",
        url: fields?.content.url ?? nft.url,
        attributes: fields?.content.attributes ?? {},
        packageModule: nft.packageModule,
        packageObjectId: nft.packageObjectId,
        packageModuleClassName: nft.packageModuleClassName,
        id: nft.id,
        rawResponse: nft.rawResponse,
        ownerAddress: nft.ownerAddress,
        collectionPackageObjectId: nft.collectionPackageObjectId,
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

  static biuldMintNft = biuldMintNftTx;

  static buildBuyNft = buildBuyNftTx;

  static buildEnableSales = buildEnableSalesTx;

  static buildCreateFlatFee = buildCreateFlatFeeTx;

  static buildInitVenue = buildInitVenueTx;

  static buildInitLimitedVenue = buildInitLimitedVenueTx;

  static buildInitMarketplace = buildInitMarketplaceTx;

  static buildInitWarehouse = buildInitWarehouseTx;

  static buildInitListing = buildInitListingTx;

  static buildRequestToJoinMarketplace = buildRequestToJoinMarketplaceTx;

  static buildAcceptListingRequest = buildAcceptListingRequestTx;

  static buildAddWarehouseToListing = buildAddWarehouseToListingTx;

  static buildSetLimtitedMarketNewLimit = buildSetLimtitedMarketNewLimitTx;

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
