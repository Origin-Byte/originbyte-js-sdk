import {
  GetObjectDataResponse,
  is,
  SuiMoveObject,
  SuiObject,
} from "@mysten/sui.js";
import { any, boolean, object, record, string } from "superstruct";
import {
  ArtNftRaw,
  ArtNftRpcResponse,
  AttributionDomainBagRpcResponse,
  CollectionDomains,
  DisplayDomain,
  DisplayDomainBagRpcResponse,
  DynamicField,
  DynamicFieldRpcResponse,
  FixedPriceMarket,
  FixedPriceMarketRpcResponse,
  FlatFee,
  FlatFeeRfcRpcResponse,
  Warehouse,
  WarehouseRpcResponse,
  Listing,
  ListingRpcResponse,
  Marketplace,
  MarketplaceRpcResponse,
  MintCap,
  MintCapRPCResponse,
  NftCollection,
  NftCollectionRpcResponse,
  RoyaltyDomain,
  RoyaltyDomainBagRpcResponse,
  SuiObjectParser,
  SymbolDomain,
  SymbolDomainBagRpcResponse,
  TagRpcResponse,
  TagsDomain,
  TagsDomainBagRpcResponse,
  UrlDomain,
  UrlDomainBagRpcResponse,
  Venue,
  VenueRpcResponse,
  InventoryRpcResponse,
  Inventory,
  InventoryDofRpcResponse,
  InventoryContent,
} from "./types";
import { parseObjectOwner } from "./utils";

export const MoveObject = object({
  type: string(),
  dataType: string(),
  fields: record(string(), any()),
  has_public_transfer: boolean(),
});

// eslint-disable-next-line max-len
const ArtNftRegex =
  /(0x[a-f0-9]{39,40})::nft::Nft<0x[a-f0-9]{39,40}::([a-zA-Z]{1,})::([a-zA-Z]{1,})>/;

export const ArtNftParser: SuiObjectParser<ArtNftRpcResponse, ArtNftRaw> = {
  parser: (data, suiData, _) => {
    if (typeof _.details === "object" && "data" in _.details) {
      const { owner } = _.details;

      const matches = (suiData.data as SuiMoveObject).type.match(ArtNftRegex);
      if (!matches) {
        return undefined;
      }
      const packageObjectId = matches[1];
      const packageModule = matches[2];
      const packageModuleClassName = matches[3];

      return {
        owner,
        ownerAddress: parseObjectOwner(owner),
        type: suiData.data.dataType,
        id: _.details.reference.objectId,
        packageObjectId,
        packageModule,
        packageModuleClassName,
        rawResponse: _,
        logicalOwner: data.logical_owner,
        bagId: data.bag?.fields.id.id,
        url: data.url,
        name: data.name,
      };
    }
    return undefined;
  },
  regex: ArtNftRegex,
};

// eslint-disable-next-line max-len
const CollectionRegex =
  /(0x[a-f0-9]{39,40})::collection::Collection<0x[a-f0-9]{39,40}::([a-zA-Z_]{1,})::([a-zA-Z_]{1,})>/;

export const CollectionParser: SuiObjectParser<
  NftCollectionRpcResponse,
  NftCollection
> = {
  parser: (data, suiData, _) => {
    const matches = (suiData.data as SuiMoveObject).type.match(CollectionRegex);
    if (!matches) {
      return undefined;
    }
    const packageObjectId = matches[1];
    const packageModule = matches[2];
    const packageModuleClassName = matches[3];

    return {
      domainsBagId: data.domains?.fields.id.id,
      id: suiData.reference.objectId,
      packageObjectId,
      packageModule,
      packageModuleClassName,
      rawResponse: _,
    };
  },

  regex: CollectionRegex,
};

export const MintCapParser: SuiObjectParser<MintCapRPCResponse, MintCap> = {
  parser: (data, suiData, _) => {
    return {
      id: suiData.reference.objectId,
      collectionId: data.collection_id,
      // regulated: data.supply_policy.fields.regulated,
      // currentSupply: data.supply_policy.fields.supply.fields.current,
      // maxSupply: data.supply_policy.fields.supply.fields.max,
      // frozen: data.supply_policy.fields.supply.fields.frozen,
      rawResponse: _,
    };
  },
  // eslint-disable-next-line max-len
  regex:
    /0x[a-f0-9]{39,40}::collection::MintCap<0x[a-f0-9]{39,40}::[a-zA-Z_]{1,}::[a-zA-Z_]{1,}>/,
};

// eslint-disable-next-line max-len
export const FixedPriceMarketRegex = /0x2::dynamic_field::Field<0x[a-f0-9]{39,40}::utils::Marker<0x[a-f0-9]{39,40}::fixed_price::FixedPriceMarket<0x2::sui::SUI>>, 0x[a-f0-9]{39,40}::fixed_price::FixedPriceMarket<0x2::sui::SUI>>/;


export const FixedPriceMarketParser: SuiObjectParser<
  FixedPriceMarketRpcResponse,
  FixedPriceMarket
> = {
  parser: (data, suiData, _) => {
    return {
      id: suiData.reference.objectId,
      rawResponse: _,
      price: data.value.fields.price,
      inventoryId: data.value.fields.inventory_id,
    };
   },
  regex: FixedPriceMarketRegex,
}

// eslint-disable-next-line max-len
export const VenueRegex =
  /(0x[a-f0-9]{40})::venue::Venue/;

export const VenueParser: SuiObjectParser<
  VenueRpcResponse,
  Venue
> = {
  parser: (data, suiData, _) => {
    return {
      id: suiData.reference.objectId,
      rawResponse: _,
      isLive: data.is_live,
      isWhitelisted: data.is_whitelisted,
    };
  },

  regex: VenueRegex,
};

const MarketplaceRegex = /(0x[a-f0-9]{39,40})::marketplace::Marketplace/;
export const MarketplaceParser: SuiObjectParser<
  MarketplaceRpcResponse,
  Marketplace
> = {
  parser: (data, suiData, _) => {
    const matches = (suiData.data as SuiMoveObject).type.match(
      MarketplaceRegex
    );

    if (!matches) {
      return undefined;
    }
    const packageObjectId = matches[1];

    return {
      id: suiData.reference.objectId,
      packageObjectId,
      rawResponse: _,
      owner: parseObjectOwner(suiData.owner),
      admin: data.admin,
      receiver: data.receiver,
      defaultFeeBoxId: data.default_fee.fields.id.id,
    };
  },
  regex: MarketplaceRegex,
};

const FLAT_FEE_REGEX = /(0x[a-f0-9]{39,40})::flat_fee::FlatFee/;

export const FlatFeeParser: SuiObjectParser<FlatFeeRfcRpcResponse, FlatFee> = {
  parser: (data, suiData, _) => {
    return {
      id: data.id.id,
      rateBps: data.rate_bps,
    };
  },
  regex: FLAT_FEE_REGEX,
};

const LISTING_REGEX = /(0x[a-f0-9]{39,40})::listing::Listing/;
export const ListingParser: SuiObjectParser<ListingRpcResponse, Listing> = {
  parser: (data, suiData, _) => {
    const matches = (suiData.data as SuiMoveObject).type.match(LISTING_REGEX);

    if (!matches) {
      return undefined;
    }
    const packageObjectId = matches[1];

    return {
      id: suiData.reference.objectId,
      packageObjectId,
      rawResponse: _,
      owner: parseObjectOwner(suiData.owner),
      marketplace: data.marketplace_id?.fields.id,
      receiver: data.receiver,
      admin: data.admin,
      customFeeBagId: data.custom_fee.fields.id.id,
      inventoriesBagId: data.inventories?.fields.id.id,
      qtSold: parseInt(data.proceeds.fields.qt_sold.fields.total, 10),
    };
  },
  regex: LISTING_REGEX,
};

const DYNAMIC_FIELD_REGEX =
  /0x2::dynamic_field::Field<0x2::dynamic_object_field::Wrapper<0x2::object::ID>, 0x2::object::ID>/;

export const DynamicFieldParser: SuiObjectParser<
  DynamicFieldRpcResponse,
  DynamicField
> = {
  regex: DYNAMIC_FIELD_REGEX,
  parser: (data, suiData, _) => {
    return {
      value: data.value,
    };
  },
};

const WAREHOUSE_REGEX = /(0x[a-f0-9]{39,40})::warehouse::Warehouse/;

export const WarehouseParser: SuiObjectParser<WarehouseRpcResponse, Warehouse> =
{
  regex: WAREHOUSE_REGEX,
  parser: (data, suiData, _) => {
    return {
      id: suiData.reference.objectId,
    };
  },
};

const INVENTORY_REGEX = /(0x[a-f0-9]{39,40})::inventory::Inventory/;

export const InventoryParser: SuiObjectParser<InventoryRpcResponse, Inventory> =
{
  regex: INVENTORY_REGEX,
  parser: (data, suiData, _) => {
    return {
      id: suiData.reference.objectId,
    };
  },
};

// eslint-disable-next-line max-len
const INVENTORY_DOF_REGEX = /0x2::dynamic_field::Field<(0x[a-f0-9]{39,40})::utils::Marker<(0x[a-f0-9]{39,40})::warehouse::Warehouse<(0x[a-f0-9]{39,40})::[a-zA-Z_]{1,}::[a-zA-Z_]{1,}>>, (0x[a-f0-9]{39,40})::warehouse::Warehouse<(0x[a-f0-9]{39,40})::[a-zA-Z_]{1,}::[a-zA-Z_]{1,}>>/

export const InventoryDofParser: SuiObjectParser<InventoryDofRpcResponse, InventoryContent> =
{
  regex: INVENTORY_DOF_REGEX,
  parser: (data, suiData, _) => {
    return {
      nfts: data.value.fields.nfts,
      id: suiData.reference.objectId,
    };
  },
};


/* eslint-disable max-len */
const ROYALTY_DOMAIN_BAG_REGEX =
  /0x2::dynamic_field::Field<(0x[a-f0-9]{39,40})::utils::Marker<(0x[a-f0-9]{39,40})::royalty::RoyaltyDomain>, (0x[a-f0-9]{39,40})::royalty::RoyaltyDomain>/;
const SYMBOL_DOMAIN_BAG_REGEX =
  /0x2::dynamic_field::Field<(0x[a-f0-9]{39,40})::utils::Marker<(0x[a-f0-9]{39,40})::display::SymbolDomain>, (0x[a-f0-9]{39,40})::display::SymbolDomain>/;
const URL_DOMAIN_BAG_REGEX =
  /0x2::dynamic_field::Field<(0x[a-f0-9]{39,40})::utils::Marker<(0x[a-f0-9]{39,40})::display::UrlDomain>, (0x[a-f0-9]{39,40})::display::UrlDomain>/;
const DISPLAY_DOMAIN_BAG_REGEX =
  /0x2::dynamic_field::Field<(0x[a-f0-9]{39,40})::utils::Marker<(0x[a-f0-9]{39,40})::display::DisplayDomain>, (0x[a-f0-9]{39,40})::display::DisplayDomain>/;
const TAGS_DOMAIN_BAG_REGEX =
  /0x2::dynamic_field::Field<(0x[a-f0-9]{39,40})::utils::Marker<(0x[a-f0-9]{39,40})::tags::TagDomain>, (0x[a-f0-9]{39,40})::tags::TagDomain>/;
const ATTRIBUTES_DOMAIN_BAG_REGEX =
  /dynamic_field::Field<(0x[a-f0-9]{39,40})::utils::Marker<(0x[a-f0-9]{39,40})::display::AttributesDomain>, (0x[a-f0-9]{39,40})::display::AttributesDomain>/;
/* eslint-enable */

const isTypeMatchRegex = (d: GetObjectDataResponse, regex: RegExp) => {
  const { details } = d;
  if (is(details, SuiObject)) {
    const { data } = details;
    if (is(data, MoveObject)) {
      return data.type.match(regex);
    }
  }
  return false;
};

export const parseBagDomains = (domains: GetObjectDataResponse[]) => {
  const response: Partial<CollectionDomains> = {};
  const royaltyDomain = domains.find((d) =>
    isTypeMatchRegex(d, ROYALTY_DOMAIN_BAG_REGEX)
  );
  const symbolDomain = domains.find((d) =>
    isTypeMatchRegex(d, SYMBOL_DOMAIN_BAG_REGEX)
  );
  const urlDomain = domains.find((d) =>
    isTypeMatchRegex(d, URL_DOMAIN_BAG_REGEX)
  );
  const displayDomain = domains.find((d) =>
    isTypeMatchRegex(d, DISPLAY_DOMAIN_BAG_REGEX)
  );
  const tagsDomain = domains.find((d) =>
    isTypeMatchRegex(d, TAGS_DOMAIN_BAG_REGEX)
  );
  const attributesDomain = domains.find((d) =>
    isTypeMatchRegex(d, ATTRIBUTES_DOMAIN_BAG_REGEX)
  );

  if (
    royaltyDomain &&
    is(royaltyDomain.details, SuiObject) &&
    is(royaltyDomain.details.data, MoveObject)
  ) {
    const { data } = royaltyDomain.details;
    response.royaltyAggregationBagId = (
      data.fields as RoyaltyDomainBagRpcResponse
    ).value.fields.aggregations.fields.id.id;
    response.royaltyStrategiesBagId = (
      data.fields as RoyaltyDomainBagRpcResponse
    ).value.fields.strategies.fields.id.id;
  }

  if (
    symbolDomain &&
    is(symbolDomain.details, SuiObject) &&
    is(symbolDomain.details.data, MoveObject)
  ) {
    const { data } = symbolDomain.details;
    response.symbol = (
      data.fields as SymbolDomainBagRpcResponse
    ).value.fields.symbol;
  }

  if (
    urlDomain &&
    is(urlDomain.details, SuiObject) &&
    is(urlDomain.details.data, MoveObject)
  ) {
    const { data } = urlDomain.details;
    response.url = (data.fields as UrlDomainBagRpcResponse).value.fields.url;
  }
  if (
    displayDomain &&
    is(displayDomain.details, SuiObject) &&
    is(displayDomain.details.data, MoveObject)
  ) {
    const { data } = displayDomain.details;
    response.description = (
      data.fields as DisplayDomainBagRpcResponse
    ).value.fields.description;
    response.name = (
      data.fields as DisplayDomainBagRpcResponse
    ).value.fields.name;
  }
  if (
    tagsDomain &&
    is(tagsDomain.details, SuiObject) &&
    is(tagsDomain.details.data, MoveObject)
  ) {
    const { data } = tagsDomain.details;
    response.tagsBagId = (
      data.fields as TagsDomainBagRpcResponse
    ).value.fields.bag.fields.id.id;
  }

  if (
    attributesDomain &&
    is(attributesDomain.details, SuiObject) &&
    is(attributesDomain.details.data, MoveObject)
  ) {
    const { data } = attributesDomain.details;
    const royalties = (
      data.fields as AttributionDomainBagRpcResponse
    ).value.fields.map.fields.contents.reduce(
      (acc, c) => ({ ...acc, [c.fields.key]: c.fields.value }),
      {}
    );
    response.attributes = royalties;
  }

  return response;
};

/* eslint-disable max-len */
const ROYALTY_DOMAIN_REGEX = /(0x[a-f0-9]{39,40})::royalty::RoyaltyDomain/;
const SYMBOL_DOMAIN_REGEX = /(0x[a-f0-9]{39,40})::display::SymbolDomain/;
const URL_DOMAIN_REGEX = /(0x[a-f0-9]{39,40})::display::UrlDomain/;
const DISPLAY_DOMAIN_REGEX = /(0x[a-f0-9]{39,40})::display::DisplayDomain/;
const TAGS_DOMAIN_REGEX = /(0x[a-f0-9]{39,40})::tags::TagDomain/;
const ATTRIBUTES_DOMAIN_REGEX =
  /(0x[a-f0-9]{39,40})::display::AttributesDomain/;
/* eslint-enable */

export const parseDynamicDomains = (domains: GetObjectDataResponse[]) => {
  const response: Partial<CollectionDomains> = {};
  const royaltyDomain = domains.find((d) =>
    isTypeMatchRegex(d, ROYALTY_DOMAIN_REGEX)
  );
  const symbolDomain = domains.find((d) =>
    isTypeMatchRegex(d, SYMBOL_DOMAIN_REGEX)
  );
  const urlDomain = domains.find((d) => isTypeMatchRegex(d, URL_DOMAIN_REGEX));

  const displayDomain = domains.find((d) =>
    isTypeMatchRegex(d, DISPLAY_DOMAIN_REGEX)
  );
  const tagsDomain = domains.find((d) =>
    isTypeMatchRegex(d, TAGS_DOMAIN_REGEX)
  );
  const attributesDomain = domains.find((d) =>
    isTypeMatchRegex(d, ATTRIBUTES_DOMAIN_REGEX)
  );

  if (
    royaltyDomain &&
    is(royaltyDomain.details, SuiObject) &&
    is(royaltyDomain.details.data, MoveObject)
  ) {
    const { data } = royaltyDomain.details;
    response.royaltyAggregationBagId = (
      data.fields as RoyaltyDomain
    ).aggregations.fields.id.id;
    response.royaltyStrategiesBagId = (
      data.fields as RoyaltyDomain
    ).aggregations.fields.id.id;
  }

  if (
    symbolDomain &&
    is(symbolDomain.details, SuiObject) &&
    is(symbolDomain.details.data, MoveObject)
  ) {
    const { data } = symbolDomain.details;
    response.symbol = (data.fields as SymbolDomain).symbol;
  }

  if (
    urlDomain &&
    is(urlDomain.details, SuiObject) &&
    is(urlDomain.details.data, MoveObject)
  ) {
    const { data } = urlDomain.details;
    response.url = (data.fields as UrlDomain).url;
  }
  if (
    displayDomain &&
    is(displayDomain.details, SuiObject) &&
    is(displayDomain.details.data, MoveObject)
  ) {
    const { data } = displayDomain.details;
    response.description = (data.fields as DisplayDomain).description;
    response.name = (data.fields as DisplayDomain).name;
  }
  if (
    tagsDomain &&
    is(tagsDomain.details, SuiObject) &&
    is(tagsDomain.details.data, MoveObject)
  ) {
    const { data } = tagsDomain.details;
    response.tagsBagId = (data.fields as TagsDomain).bag.fields.id.id;
  }

  if (
    attributesDomain &&
    is(attributesDomain.details, SuiObject) &&
    is(attributesDomain.details.data, MoveObject)
  ) {
    const { data } = attributesDomain.details;
    const royalties = (
      data.fields as AttributionDomainBagRpcResponse
    ).value.fields.map.fields.contents.reduce(
      (acc, c) => ({ ...acc, [c.fields.key]: c.fields.value }),
      {}
    );
    response.attributes = royalties;
  }

  return response;
};

export const parseTags = (tags: GetObjectDataResponse[]) => {
  return tags.map((tag) => {
    if (is(tag.details, SuiObject) && is(tag.details.data, SuiMoveObject)) {
      const { data } = tag.details;
      const fields = data.fields as TagRpcResponse;
      return fields.value.type.split(":tags::")[1];
    }
    return undefined;
  });
};
