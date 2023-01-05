import {
  GetObjectDataResponse, isSuiMoveObject, isSuiObject, SuiMoveObject,
} from "@mysten/sui.js";
import {
  ArtNftRaw,
  ArtNftRpcResponse,
  AttributionDomainRpcResponse,
  CollectionDomains,
  DisplayDomainRpcResponse,
  FixedPriceMarket,
  FixedPriceMarketRpcResponse,
  MintCap,
  MintCapRPCResponse,
  NftCertificate,
  NftCertificateRpcResponse,
  NftCollection,
  NftCollectionRpcResponse,
  RoyaltyDomainRpcResponse,
  SuiObjectParser,
  SymbolDomainRpcResponse,
  TagsDomainRpcResponse,
  UrlDomainRpcResponse,
  TagRpcResponse,
  Launchpad,
  LaunchpadRpcResponse,
  FlatFeeRfcRpcResponse,
  FlatFee,
  LaunchpadSlot,
  LaunchpadSlotRpcResponse,
  DynamicFieldRpcResponse,
  DynamicField,
  InventoryRpcResponse,
  Inventory,
} from "./types";
import { parseObjectOwner } from "./utils";

// eslint-disable-next-line max-len
const ArtNftRegex = /(0x[a-f0-9]{39,40})::nft::Nft<0x[a-f0-9]{39,40}::([a-zA-Z]{1,})::([a-zA-Z]{1,})>/;

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
        bagId: data.bag.fields.id.id,
      };
    }
    return undefined;
  },
  regex: ArtNftRegex,
};

// eslint-disable-next-line max-len
const CollectionRegex = /(0x[a-f0-9]{39,40})::collection::Collection<0x[a-f0-9]{39,40}::([a-zA-Z_]{1,})::([a-zA-Z_]{1,})>/;

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
      domainsBagId: data.domains.fields.id.id,
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
    console.log("data: ", JSON.stringify(data));
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
  regex: /0x[a-f0-9]{39,40}::collection::MintCap<0x[a-f0-9]{39,40}::[a-zA-Z_]{1,}::[a-zA-Z_]{1,}>/,
};

// eslint-disable-next-line max-len
export const FixedPriceMarketRegex = /(0x[a-f0-9]{40})::fixed_price::FixedPriceMarket/;

export const FixedPriceMarketParser: SuiObjectParser<
  FixedPriceMarketRpcResponse,
  FixedPriceMarket
> = {
  parser: (data, suiData, _) => {
    return {
      id: suiData.reference.objectId,
      rawResponse: _,
      price: data.price,
    };
  },

  regex: FixedPriceMarketRegex,
};

const NftCertificateRegex = /(0x[a-f0-9]{40})::slot::NftCertificate/;
export const NftCertificateParser: SuiObjectParser<NftCertificateRpcResponse, NftCertificate> = {
  parser: (data, suiData, _) => {
    const matches = (suiData.data as SuiMoveObject).type.match(
      NftCertificateRegex
    );

    if (!matches) {
      return undefined;
    }
    const packageObjectId = matches[1];

    return {
      id: suiData.reference.objectId,
      nftId: data.nft_id,
      packageObjectId,
      launchpadId: data.launchpad_id,
      rawResponse: _,
      slotId: data.slot_id,
      owner: parseObjectOwner(suiData.owner),
    };
  },
  regex: NftCertificateRegex,
};

const LaunchpadRegex = /(0x[a-f0-9]{39,40})::launchpad::Launchpad/;
export const LaunchpadParser: SuiObjectParser<LaunchpadRpcResponse, Launchpad> = {
  parser: (data, suiData, _) => {
    const matches = (suiData.data as SuiMoveObject).type.match(LaunchpadRegex);

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
      permissioned: data.permissioned,
      defaultFeeBoxId: data.default_fee.fields.id.id,
    };
  },
  regex: LaunchpadRegex,
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

const LAUNCHPAD_SLOT_REGEX = /(0x[a-f0-9]{39,40})::slot::Slot/;
export const LaunchpadSlotParser: SuiObjectParser<LaunchpadSlotRpcResponse, LaunchpadSlot> = {
  parser: (data, suiData, _) => {
    const matches = (suiData.data as SuiMoveObject).type.match(LAUNCHPAD_SLOT_REGEX);

    if (!matches) {
      return undefined;
    }
    const packageObjectId = matches[1];

    return {
      id: suiData.reference.objectId,
      packageObjectId,
      rawResponse: _,
      owner: parseObjectOwner(suiData.owner),
      launchpad: data.launchpad_id,
      receiver: data.receiver,
      admin: data.admin,
      customFeeBagId: data.custom_fee.fields.id.id,
      inventoriesBagId: data.inventories.fields.id.id,
      marketsBagId: data.markets.fields.id.id,
      qtSold: parseInt(data.proceeds.fields.qt_sold.fields.total, 10),
      live: data.live,
    };
  },
  regex: LAUNCHPAD_SLOT_REGEX,
};

const DYNAMIC_FIELD_REGEX = /0x2::dynamic_field::Field<0x2::dynamic_object_field::Wrapper<0x2::object::ID>, 0x2::object::ID>/;

export const DynamicFieldParser: SuiObjectParser<DynamicFieldRpcResponse, DynamicField> = {
  regex: DYNAMIC_FIELD_REGEX,
  parser: (data, suiData, _) => {
    return {
      value: data.value,
    };
  },
};

const INVENTORY_REGEX = /(0x[a-f0-9]{39,40})::inventory::Inventory/;

export const InventoryParser: SuiObjectParser<InventoryRpcResponse, Inventory> = {
  regex: INVENTORY_REGEX,
  parser: (data, suiData, _) => {
    return {
      id: suiData.reference.objectId,
      queue: data.queue,
      nftsOnSale: data.nfts_on_sale,
    };
  },
};

/* eslint-disable max-len */
const ROYALTY_DOMAIN_REGEX = /0x2::dynamic_field::Field<(0x[a-f0-9]{39,40})::utils::Marker<(0x[a-f0-9]{39,40})::royalty::RoyaltyDomain>, (0x[a-f0-9]{39,40})::royalty::RoyaltyDomain>/;
const SYMBOL_DOMAIN_REGEX = /0x2::dynamic_field::Field<(0x[a-f0-9]{39,40})::utils::Marker<(0x[a-f0-9]{39,40})::display::SymbolDomain>, (0x[a-f0-9]{39,40})::display::SymbolDomain>/;
const URL_DOMAIN_REGEX = /0x2::dynamic_field::Field<(0x[a-f0-9]{39,40})::utils::Marker<(0x[a-f0-9]{39,40})::display::UrlDomain>, (0x[a-f0-9]{39,40})::display::UrlDomain>/;
const DISPLAY_DOMAIN_REGEX = /0x2::dynamic_field::Field<(0x[a-f0-9]{39,40})::utils::Marker<(0x[a-f0-9]{39,40})::display::DisplayDomain>, (0x[a-f0-9]{39,40})::display::DisplayDomain>/;
const TAGS_DOMAIN_REGEX = /0x2::dynamic_field::Field<(0x[a-f0-9]{39,40})::utils::Marker<(0x[a-f0-9]{39,40})::tags::TagDomain>, (0x[a-f0-9]{39,40})::tags::TagDomain>/;
const ATTRIBUTES_DOMAIN_REGEX = /dynamic_field::Field<(0x[a-f0-9]{39,40})::utils::Marker<(0x[a-f0-9]{39,40})::attribution::AttributionDomain>, (0x[a-f0-9]{39,40})::attribution::AttributionDomain>/;
/* eslint-enable */

const isTypeMatchRegex = (d: GetObjectDataResponse, regex: RegExp) => {
  const { details } = d;
  if (isSuiObject(details)) {
    const { data } = details;
    if (isSuiMoveObject(data)) {
      return data.type.match(regex);
    }
  }
  return false;
};

export const parseDomains = (domains: GetObjectDataResponse[]) => {
  const response: Partial<CollectionDomains> = {};
  const royaltyDomain = domains.find((d) => isTypeMatchRegex(d, ROYALTY_DOMAIN_REGEX));
  const symbolDomain = domains.find((d) => isTypeMatchRegex(d, SYMBOL_DOMAIN_REGEX));
  const urlDomain = domains.find((d) => isTypeMatchRegex(d, URL_DOMAIN_REGEX));
  const displayDomain = domains.find((d) => isTypeMatchRegex(d, DISPLAY_DOMAIN_REGEX));
  const tagsDomain = domains.find((d) => isTypeMatchRegex(d, TAGS_DOMAIN_REGEX));
  const attributesDomain = domains.find((d) => isTypeMatchRegex(d, ATTRIBUTES_DOMAIN_REGEX));

  if (royaltyDomain && isSuiObject(royaltyDomain.details) && isSuiMoveObject(royaltyDomain.details.data)) {
    const { data } = royaltyDomain.details;
    response.royaltyAggregationBagId = (data.fields as RoyaltyDomainRpcResponse).value.fields.aggregations.fields.id.id;
    response.royaltyStrategiesBagId = (data.fields as RoyaltyDomainRpcResponse).value.fields.strategies.fields.id.id;
  }

  if (symbolDomain && isSuiObject(symbolDomain.details) && isSuiMoveObject(symbolDomain.details.data)) {
    const { data } = symbolDomain.details;
    response.symbol = (data.fields as SymbolDomainRpcResponse).value.fields.symbol;
  }

  if (urlDomain && isSuiObject(urlDomain.details) && isSuiMoveObject(urlDomain.details.data)) {
    const { data } = urlDomain.details;
    response.url = (data.fields as UrlDomainRpcResponse).value.fields.url;
  }
  if (displayDomain && isSuiObject(displayDomain.details) && isSuiMoveObject(displayDomain.details.data)) {
    const { data } = displayDomain.details;
    response.description = (data.fields as DisplayDomainRpcResponse).value.fields.description;
    response.name = (data.fields as DisplayDomainRpcResponse).value.fields.name;
  }
  if (tagsDomain && isSuiObject(tagsDomain.details) && isSuiMoveObject(tagsDomain.details.data)) {
    const { data } = tagsDomain.details;
    response.tagsBagId = (data.fields as TagsDomainRpcResponse).value.fields.bag.fields.id.id;
  }

  if (attributesDomain && isSuiObject(attributesDomain.details) && isSuiMoveObject(attributesDomain.details.data)) {
    const { data } = attributesDomain.details;
    const royalties = (data.fields as AttributionDomainRpcResponse)
      .value.fields.creators.fields.contents.map((c) => ({
        who: c.fields.value.fields.who, bps: c.fields.value.fields.share_of_royalty_bps,
      }));
    response.royalties = royalties;
  }

  return response;
};

export const parseTags = (tags: GetObjectDataResponse[]) => {
  return tags.map((tag) => {
    if (isSuiObject(tag.details) && isSuiMoveObject(tag.details.data)) {
      const { data } = tag.details;
      const fields = data.fields as TagRpcResponse;
      return fields.value.type.split(":tags::")[1];
    }
    return undefined;
  });
};
