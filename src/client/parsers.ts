import { SuiObjectResponse } from "@mysten/sui.js";
import { any, boolean, object, record, string } from "superstruct";
import {
  ArtNftRaw,
  AttributionDomainBagRpcResponse,
  CollectionDomains,
  DisplayDomainBagRpcResponse,
  DynamicField,
  EmptyModel,
  FixedPriceMarket,
  FlatFee,
  Inventory,
  InventoryContent,
  LimitedFixedPriceMarket,
  Listing,
  Marketplace,
  MintCap,
  NftCollection,
  RoyaltyDomain,
  SuiObjectParser,
  SymbolDomainBagRpcResponse,
  TagRpcResponse,
  TagsDomain,
  UrlDomain,
  Venue,
  Warehouse,
} from "./types";
import { parseObjectOwner } from "./utils";

export const MoveObject = object({
  type: string(),
  dataType: string(),
  fields: record(string(), any()),
  has_public_transfer: boolean(),
});

const getEmptyParser = (regex: RegExp): SuiObjectParser<EmptyModel> => ({
  regex,
  parser: (data) => {
    const matches = data.data.type.match(regex);
    if (!matches) {
      return undefined;
    }

    const packageObjectId = matches[1];

    return {
      packageObjectId,
      id: data.data.objectId,
      owner: parseObjectOwner(data.data.owner),
    };
  },
});

const ART_NFT_REGEX =
  /^(0x[a-f0-9]{63,64})::([a-zA-Z]{1,})::([a-zA-Z]{1,})$/;

export const ArtNftParser: SuiObjectParser<ArtNftRaw> = {
  parser: (_) => {
    const { owner, content, display } = _.data;

    if (content && "fields" in content) {
      const matches = _.data.type.match(ART_NFT_REGEX);
      if (!matches) {
        return undefined;
      }

      const collectionPackageObjectId = matches[1];
      const packageModule = matches[2];
      const packageModuleClassName = matches[3];

      const result = {
        owner,
        ownerAddress: parseObjectOwner(owner),
        type: _.data.type,
        id: _.data.objectId,
        collectionPackageObjectId,
        packageModule,
        packageModuleClassName,
        rawResponse: _,
        logicalOwner: content.fields.logical_owner,
        bagId: content.fields.bag?.fields.id.id,
        url: (typeof display?.data === "object") ? (display?.data.image_url ?? content.fields.url) : content.fields.url,
        name: (typeof display?.data === "object") ? (display?.data.name ?? content.fields.name) : content.fields.name,
      };

      if (!result.url) {
        return undefined;
      }
      return result;
    }
    return undefined;
  },
  regex: ART_NFT_REGEX,
};

const COLLECTION_REGEX =
  /^(0x[a-f0-9]{63,64})::collection::Collection<(0x[a-f0-9]{63,64}::[a-zA-Z_]{1,}::[a-zA-Z_]{1,}(.*))>$/;

export const CollectionParser: SuiObjectParser<NftCollection> = {
  parser: (_) => {
    const matches = _.data.type.match(COLLECTION_REGEX);

    if (!matches) {
      return undefined;
    }
    const nftProtocolPackageObjectId = matches[1];
    const collectionNftType = matches[2];

    if ("fields" in _.data.content) {
      const { fields } = _.data.content;
      return {
        domainsBagId: fields.domains?.fields.id.id,
        id: _.data.objectId,
        nftProtocolPackageObjectId,
        collectionNftType,
        rawResponse: _,
      };
    }
    return undefined;
  },

  regex: COLLECTION_REGEX,
};

const MINT_CAP_REGEX =
  /^(0x[a-f0-9]{63,64})::mint_cap::MintCap<0x[a-f0-9]{63,64}::[a-zA-Z_]{1,}::[a-zA-Z_]{1,}>$/;

export const MintCapParser: SuiObjectParser<MintCap> = {
  parser: (_) => {
    const defaultData = getEmptyParser(MINT_CAP_REGEX).parser(_);
    if ("fields" in _.data.content) {
      return {
        ...defaultData,
        collectionId: _.data.content.fields.collection_id,
        rawResponse: _,
      };
    }
    return undefined;
  },

  regex: MINT_CAP_REGEX,
};

const ORDER_BOOK_REGEX =
  // eslint-disable-next-line max-len
  /^(0x[a-f0-9]{63,64})::orderbook::Orderbook<0x[a-f0-9]{63,64}::[a-zA-Z_]{1,}::[a-zA-Z_]{1,}, 0x[a-f0-9]{1,40}::[a-zA-Z_]{1,}::[a-zA-Z_]{1,}>$/;

export const OrderbookParser = getEmptyParser(ORDER_BOOK_REGEX);

export const FIXED_PRICE_MARKET_REGEX =
  // eslint-disable-next-line max-len
  /0x2::dynamic_field::Field<(0x[a-f0-9]{63,64})::utils::Marker<0x[a-f0-9]{63,64}::fixed_price::FixedPriceMarket<0x2::sui::SUI>>, 0x[a-f0-9]{63,64}::fixed_price::FixedPriceMarket<0x2::sui::SUI>>/;

export const FixedPriceMarketParser: SuiObjectParser<FixedPriceMarket> = {
  parser: (_) => {
    const matches = _.data.type.match(FIXED_PRICE_MARKET_REGEX);
    if (!matches) {
      return undefined;
    }
    const packageObjectId = matches[1];
    if ("fields" in _.data.content) {
      return {
        id: _.data.objectId,
        packageObjectId,
        rawResponse: _,
        price: _.data.content.fields.value.fields.price,
        inventoryId: _.data.content.fields.value.fields.inventory_id,
        marketType: "fixed_price",
      };
    }
    return undefined;
  },
  regex: FIXED_PRICE_MARKET_REGEX,
};

export const LIMITED_FIXED_PRICE_MARKET_REGEX =
  // eslint-disable-next-line max-len
  /0x2::dynamic_field::Field<(0x[a-f0-9]{63,64})::utils::Marker<0x[a-f0-9]{63,64}::limited_fixed_price::LimitedFixedPriceMarket<0x2::sui::SUI>>, 0x[a-f0-9]{63,64}::limited_fixed_price::LimitedFixedPriceMarket<0x2::sui::SUI>>/;

export const LimitedFixedPriceMarketParser: SuiObjectParser<LimitedFixedPriceMarket> =
{
  parser: (_) => {
    const matches = _.data.type.match(LIMITED_FIXED_PRICE_MARKET_REGEX);
    if (!matches) {
      return undefined;
    }
    const packageObjectId = matches[1];
    if ("fields" in _.data.content) {
      const { fields } = _.data.content;
      return {
        id: _.data.objectId,
        packageObjectId,
        rawResponse: _,
        price: fields.value.fields.price,
        inventoryId: fields.value.fields.inventory_id,
        limit: parseFloat(fields.value.fields.limit),
        addresses: (fields.value.fields.addresses.fields.contents as { fields: { key: string, value: string } }[]).reduce(
          (acc, address) => acc.set(address.fields.key, parseInt(address.fields.value, 10)), new Map<string, number>()
        ),
        marketType: "limited_fixed_price",
      };
    }
    return undefined;
  },
  regex: LIMITED_FIXED_PRICE_MARKET_REGEX,
};

// eslint-disable-next-line max-len
export const VENUE_REGEX = /(0x[a-f0-9]{63,64})::venue::Venue/;

export const VenueParser: SuiObjectParser<Venue> = {
  parser: (_) => {
    const matches = _.data.type.match(VENUE_REGEX);
    if (!matches) {
      return undefined;
    }
    const packageObjectId = matches[1];
    if ("fields" in _.data.content) {
      const { fields } = _.data.content;
      return {
        packageObjectId,
        id: _.data.objectId,
        rawResponse: _,
        isLive: fields.is_live,
        isWhitelisted: fields.is_whitelisted,
      };
    }
    return undefined;
  },

  regex: VENUE_REGEX,
};

const MARKETPLACE_REGEX = /(0x[a-f0-9]{63,64})::marketplace::Marketplace/;
export const MarketplaceParser: SuiObjectParser<Marketplace> = {
  parser: (_) => {
    const matches = _.data.type.match(MARKETPLACE_REGEX);

    if (!matches) {
      return undefined;
    }
    const packageObjectId = matches[1];

    if ("fields" in _.data.content) {
      const { fields } = _.data.content;
      return {
        id: _.data.objectId,
        packageObjectId,
        rawResponse: _,
        owner: parseObjectOwner(_.data.owner),
        admin: fields.admin,
        receiver: fields.receiver,
        defaultFeeBoxId: fields.default_fee.fields.id.id,
      };
    }
    return undefined;
  },
  regex: MARKETPLACE_REGEX,
};

const FLAT_FEE_REGEX = /(0x[a-f0-9]{63,64})::launchpad::FlatFee/;

export const FlatFeeParser: SuiObjectParser<FlatFee> = {
  parser: (data) => {
    const matches = data.data.type.match(FLAT_FEE_REGEX);

    if (!matches) {
      return undefined;
    }
    const packageObjectId = matches[1];
    if ("fields" in data.data.content) {
      return {
        id: data.data.objectId,
        rateBps: data.data.content.fields.rate_bps,
        packageObjectId,
      };
    }
    return undefined;
  },
  regex: FLAT_FEE_REGEX,
};

const LISTING_REGEX = /(0x[a-f0-9]{63,64})::listing::Listing/;
export const ListingParser: SuiObjectParser<Listing> = {
  parser: (_) => {
    const matches = _.data.type.match(LISTING_REGEX);

    if (!matches) {
      return undefined;
    }
    const packageObjectId = matches[1];

    if ("fields" in _.data.content) {
      return {
        id: _.data.objectId,
        packageObjectId,
        rawResponse: _,
        owner: parseObjectOwner(_.data.owner),
        marketplace: _.data.content.fields.marketplace_id?.fields.id,
        receiver: _.data.content.fields.receiver,
        admin: _.data.content.fields.admin,
        customFeeBagId: _.data.content.fields.custom_fee.fields.id.id,
        inventoriesBagId: _.data.content.fields.inventories?.fields.id.id,
        venuesBagId: _.data.content.fields.venues?.fields.id.id,
        qtSold: parseInt(
          _.data.content.fields.proceeds.fields.qt_sold.fields.total,
          10
        ),
      };
    }
    return undefined;
  },
  regex: LISTING_REGEX,
};

const DYNAMIC_FIELD_REGEX =
  /0x2::dynamic_field::Field<0x2::dynamic_object_field::Wrapper<0x2::object::ID>, 0x2::object::ID>/;

export const DynamicFieldParser: SuiObjectParser<DynamicField> = {
  regex: DYNAMIC_FIELD_REGEX,
  parser: (data) => {
    return {
      value:
        "fields" in data.data.content ? data.data.content.fields.value : "",
    };
  },
};

const WAREHOUSE_REGEX = /(0x[a-f0-9]{63,64})::warehouse::Warehouse/;

export const WarehouseParser: SuiObjectParser<Warehouse> = {
  regex: WAREHOUSE_REGEX,
  parser: (data) => {
    return {
      id: data.data.objectId,
    };
  },
};

const INVENTORY_REGEX =
  /(0x[a-f0-9]{63,64})::inventory::Inventory<((0x[a-f0-9]{63,64})::([a-zA-Z_]{1,})::([a-zA-Z_]{1,})(.*))>/;

export const InventoryParser: SuiObjectParser<Inventory> = {
  regex: INVENTORY_REGEX,
  parser: (_) => {
    const matches = _.data.type.match(INVENTORY_REGEX);

    if (!matches) {
      return undefined;
    }
    if ("fields" in _.data.content) {
      return {
        id: _.data.objectId,
        nftType: matches[2],
        collectionContractPackageId: matches[3],
        packageModule: matches[4],
        packageModuleClassName: matches[5],
        packageObjectId: matches[1],
        rawResponse: _,
        owner: parseObjectOwner(_.data.owner),
      };
    }
    return undefined;
  },
};

const INVENTORY_DOF_REGEX =
  // eslint-disable-next-line max-len
  /0x2::dynamic_field::Field<(0x[a-f0-9]{63,64})::utils::Marker<(0x[a-f0-9]{63,64})::warehouse::Warehouse<(0x[a-f0-9]{63,64})::[a-zA-Z_]{1,}::[a-zA-Z_]{1,}>>, (0x[a-f0-9]{63,64})::warehouse::Warehouse<(0x[a-f0-9]{63,64})::[a-zA-Z_]{1,}::[a-zA-Z_]{1,}>>/;

export const InventoryDofParser: SuiObjectParser<InventoryContent> = {
  regex: INVENTORY_DOF_REGEX,
  parser: (_) => {
    return {
      nfts: "fields" in _.data.content ? _.data.content.fields.value.fields.nfts : [],
      id: _.data.objectId,
    };
  },
};

const ALLOWLIST_REGEX = /(0x[a-f0-9]{63,64})::transfer_allowlist::Allowlist/;

export const AllowlistParser = getEmptyParser(ALLOWLIST_REGEX);

const isTypeMatchRegex = (d: SuiObjectResponse, regex: RegExp) => {
  return !!d.data.type.match(regex);
};

/* eslint-disable max-len */
const ROYALTY_DOMAIN_REGEX = /(0x[a-f0-9]{63,64})::royalty::RoyaltyDomain/;
const SYMBOL_DOMAIN_REGEX = /(0x[a-f0-9]{63,64})::display::SymbolDomain/;
const URL_DOMAIN_REGEX = /(0x[a-f0-9]{63,64})::display::UrlDomain/;
const DISPLAY_DOMAIN_REGEX = /(0x[a-f0-9]{63,64})::display::DisplayDomain/;
const TAGS_DOMAIN_REGEX = /(0x[a-f0-9]{63,64})::tags::TagDomain/;
const ATTRIBUTES_DOMAIN_REGEX =
  /(0x[a-f0-9]{63,64})::display::AttributesDomain/;
/* eslint-enable */

export const parseDynamicDomains = (domains: SuiObjectResponse[]) => {
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

  if (royaltyDomain && "fields" in royaltyDomain.data.content) {
    const { fields } = royaltyDomain.data.content;
    response.royaltyAggregationBagId = (
      fields as RoyaltyDomain
    ).value.fields.aggregations.id;
    response.royaltyStrategiesBagId = (
      fields as RoyaltyDomain
    ).value.fields.aggregations.id;
  }

  if (symbolDomain && "fields" in royaltyDomain.data.content) {
    const { fields } = royaltyDomain.data.content;
    response.symbol = (
      fields as SymbolDomainBagRpcResponse
    ).value.fields.symbol;
  }

  if (urlDomain && "fields" in urlDomain.data.content) {
    const { fields } = urlDomain.data.content;
    response.url = (fields as UrlDomain).url;
  }

  if (displayDomain && "fields" in displayDomain.data.content) {
    const { fields } = displayDomain.data.content;
    response.description = (
      fields as DisplayDomainBagRpcResponse
    ).value.fields.description;
    response.name = (
      fields as DisplayDomainBagRpcResponse
    ).value.fields.name;
  }
  if (tagsDomain && "fields" in tagsDomain.data.content) {
    const { fields } = tagsDomain.data.content;
    response.tagsBagId = (fields as TagsDomain).value.fields.id.id;
  }

  if (attributesDomain && "fields" in attributesDomain.data.content) {
    const { fields } = attributesDomain.data.content;
    const royalties = (
      fields as AttributionDomainBagRpcResponse
    ).value.fields.map.fields.contents.reduce(
      (acc, c) => ({ ...acc, [c.fields.key]: c.fields.value }),
      {}
    );
    response.attributes = royalties;
  }

  return response;
};

export const parseTags = (tags: SuiObjectResponse[]) => {
  return tags.map((tag) => {
    if ("fields" in tag.data.content) {
      const fields = tag.data.content.fields as TagRpcResponse;
      return fields.value.type.split(":tags::")[1];
    }
    return undefined;
  });
};
