import { Connection, JsonRpcProvider, SuiObjectResponse } from "@mysten/sui.js";
import { toMap } from "../utils";
import { TESTNET_URL } from "./consts";
import {
  ArtNftParser,
  CollectionParser,
  FixedPriceMarketParser,
  FlatFeeParser,
  InventoryDofParser,
  InventoryParser,
  LimitedFixedPriceMarketParser,
  ListingParser,
  MarketplaceParser,
  MintCapParser,
  parseDynamicDomains,
  parseTags,
  VenueParser,
  WarehouseParser,
} from "./parsers";
import {
  buildAcceptListingRequestTx,
  buildAddWarehouseToListingTx,
  buildBuyNftTx,
  buildBuyWhitelistedNftTx,
  buildCreateFlatFeeTx,
  buildEnableSalesTx,
  buildInitLimitedVenueTx,
  buildInitListingTx,
  buildInitMarketplaceTx,
  buildInitVenueTx,
  buildInitWarehouseTx,
  buildIssueWhitelistCertificateTx,
  buildMintNftTx,
  buildRequestToJoinMarketplaceTx,
  buildSetLimtitedMarketNewLimitTx,
  buildDisableSalesTx,
} from "./txBuilders";
import {
  ArtNft,
  DefaultFeeBoxRpcResponse,
  GetCollectionDomainsParams,
  GetCollectionsParams,
  GetInventoryParams,
  GetListingParams,
  GetMarketplaceParams,
  GetMintCapsParams,
  GetNftsParams,
  GetVenuesParams,
  GetWarehouseParams,
  Inventory,
  MintCap,
  NftCollection,
  SuiObjectParser,
  Venue,
  VenueWithMarket,
} from "./types";

export class NftClient {
  private provider: JsonRpcProvider;

  constructor(
    _provider = new JsonRpcProvider(new Connection({ fullnode: TESTNET_URL }))
  ) {
    this.provider = _provider;
  }

  private fetchObjectIdsForAddress = async <DataModel>(
    owner: string,
    parser: SuiObjectParser<DataModel>
  ): Promise<string[]> => {
    const objectsForWallet = await this.provider.getOwnedObjects({ owner, options: { showType: true } });

    return objectsForWallet.data
      .filter((_) => _.data.type.match(parser.regex))
      .map((_) => _.data.objectId);
  };

  parseObjects = async <DataModel>(
    objects: SuiObjectResponse[],
    parser: SuiObjectParser<DataModel>
  ): Promise<DataModel[]> => {
    const parsedObjects = objects
      .filter((_) => !!_.data)
      .map((_) => {
        return parser.parser(_);
      })
      .filter((_): _ is DataModel => !!_);

    return parsedObjects;
  };

  fetchAndParseObjectsById = async <DataModel>(
    ids: string[],
    parser: SuiObjectParser<DataModel>
  ): Promise<DataModel[]> => {
    if (ids.length === 0) {
      return [];
    }
    const objects = await this.provider.multiGetObjects({
      ids,
      options: {
        showContent: true,
        showDisplay: true,
        showType: true,
        showOwner: true,
      },
    });
    return this.parseObjects(objects, parser);
  };

  fetchAndParseObjectsForAddress = async <DataModel>(
    address: string,
    parser: SuiObjectParser<DataModel>
  ) => {
    const objectIds = await this.fetchObjectIdsForAddress(address, parser);
    return this.fetchAndParseObjectsById(objectIds, parser);
  };

  getMintCapsById = async (params: GetMintCapsParams) => {
    return this.fetchAndParseObjectsById(params.objectIds, MintCapParser);
  };

  getVenuesById = async (params: GetVenuesParams) => {
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
    const collections = await this.fetchAndParseObjectsById(
      params.objectIds,
      CollectionParser
    );
    return Promise.all(
      collections.map(async (collection) => {
        const f = await this.getDynamicFields(collection.id);
        return {
          ...collection,
          ...parseDynamicDomains(f),
        };
      })
    );
  };

  getDynamicFields = async (parentId: string) => {
    const objects = await this.provider.getDynamicFields({ parentId });
    const ids = objects.data.map((_) => _.objectId);
    return this.provider.multiGetObjects({
      ids,
      options: {
        showContent: true,
        showType: true,
        showDisplay: true,
        showOwner: true,
      },
    });
  };

  getBagContent = async (bagId: string) => {
    const bagObjects = await this.provider.getDynamicFields({
      parentId: bagId,
    });
    let objectIds: string[];
    if (Array.isArray(bagObjects)) {
      objectIds = bagObjects.map(({ objectId }) => objectId);
    } else {
      objectIds = bagObjects.data.map(({ objectId }) => objectId);
    }
    return this.provider.multiGetObjects({
      ids: objectIds,
      options: {
        showContent: true,
        showType: true,
        showDisplay: true,
        showOwner: true,
      },
    });
  };

  getAndParseBagContent = async <DataModel>(
    bagId: string,
    parser: SuiObjectParser<DataModel>
  ) => {
    const bagObjects = await this.getBagContent(bagId);
    return this.parseObjects(bagObjects, parser);
  };

  getCollectionDomains = async (params: GetCollectionDomainsParams) => {
    const domains = await this.getBagContent(params.domainsBagId);

    const parsedDomains = parseDynamicDomains(domains);

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

    if ("fields" in fee.data.content) {
      const feeBox = fee.data.content.fields as DefaultFeeBoxRpcResponse;
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

    const NO_VENUES: Venue[] = [];
    const NO_INVENTORIES: Inventory[] = [];

    if (!params.resolveBags) {
      return { ...listing, venues: NO_VENUES, inventories: NO_INVENTORIES };
    }

    const [inventories, venues] = await Promise.all([
      listing.inventoriesBagId
        ? this.getAndParseBagContent(listing.inventoriesBagId, InventoryParser)
        : NO_INVENTORIES,
      listing.venuesBagId
        ? this.getAndParseBagContent(listing.venuesBagId, VenueParser)
        : NO_VENUES,
    ]);
    return {
      ...listing,
      inventories,
      venues,
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
      ...inventory,
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
            content: parseDynamicDomains(content),
          };
        })
      )
      : [];
    const bagsByNftId = toMap(bags, (_) => _.nftId);

    return nfts.map((nft) => {
      const fields = bagsByNftId.get(nft.id);
      const a: ArtNft = {
        logicalOwner: nft.logicalOwner,
        name: fields?.content.name ?? nft.name,
        description: fields?.content.description ?? "",
        url: fields?.content.url ?? nft.url,
        attributes: fields?.content.attributes ?? {},
        packageModule: nft.packageModule,
        packageModuleClassName: nft.packageModuleClassName,
        id: nft.id,
        rawResponse: nft.rawResponse,
        ownerAddress: nft.ownerAddress,
        collectionPackageObjectId: nft.collectionPackageObjectId,
      };
      return a;
    });
  };

  getNftsForAddress = async (address: string) => {
    const objectIds = await this.fetchObjectIdsForAddress(
      address,
      ArtNftParser
    );
    return this.getNftsById({ objectIds });
  };

  static buildMintNft = buildMintNftTx;

  static buildBuyNft = buildBuyNftTx;

  static buildEnableSales = buildEnableSalesTx;

  static buildDisableSales = buildDisableSalesTx;

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

  static buildBuyWhitelistedNft = buildBuyWhitelistedNftTx;

  static buildIssueWhitelistCertificate = buildIssueWhitelistCertificateTx;

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
