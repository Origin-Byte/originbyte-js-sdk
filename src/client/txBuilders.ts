import { MoveCallTransaction } from "@mysten/sui.js";
import {
  BuildBuyNftParams,
  BuildInitWarehouseParams,
  BuildCreateFlatFeeParams,
  BuildEnableSalesParams,
  BuildInitMarketplaceParams,
  BuildInitListingParams,
  BuildMintNftParams,
  BuildInitVenueParams,
  BuildRequestToJoinMarketplaceParams,
  BuildAcceptListingRequest,
  BuildAddWarehouseToListingParams,
  BuildInitLimitedVenueParams,
  BuildSetLimitMarketLimitParams,
  BuildIsueWhitelistCertificateParams,
  BuildBuyWhitelistedNftParams,
} from "./types";

const SUI_TYPE = "0x2::sui::SUI";

export const biuldMintNftTx = (
  params: BuildMintNftParams
): MoveCallTransaction => {
  const keys: string[] = [];
  const values: string[] = [];
  const { attributes } = params;
  Object.keys(attributes).forEach((key) => {
    keys.push(key);
    values.push(attributes[key]);
  });

  return {
    packageObjectId: params.packageObjectId,
    module: params.moduleName,
    function: "mint_nft",
    typeArguments: [],
    arguments: [
      params.name,
      params.description,
      params.url,
      keys,
      values,
      params.mintCap,
      params.warehouseId,
    ],
    gasBudget: params.gasBudget ?? 10000,
  };
};

export const buildBuyNftTx = (
  params: BuildBuyNftParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: params.module ?? "fixed_price",
  function: "buy_nft",
  typeArguments: [
    `${params.collectionPackageId ?? params.packageObjectId}::${
      params.nftModuleName
    }::${params.nftClassName}`,
    SUI_TYPE,
  ],
  arguments: [params.listing, params.venue, params.coin],
  gasBudget: params.gasBudget ?? 5000,
});

export const buildBuyWhitelistedNftTx = (
  params: BuildBuyWhitelistedNftParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: params.module ?? "fixed_price",
  function: "buy_whitelisted_nft",
  typeArguments: [
    `${params.collectionPackageId ?? params.packageObjectId}::${
      params.nftModuleName
    }::${params.nftClassName}`,
    SUI_TYPE,
  ],
  arguments: [
    params.listing,
    params.venue,
    params.coin,
    params.whitelistCertificate,
  ],
  gasBudget: params.gasBudget ?? 5000,
});

export const buildInitVenueTx = (
  params: BuildInitVenueParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "fixed_price",
  function: "init_venue",
  typeArguments: [
    `${params.collectionPackageId ?? params.packageObjectId}::${
      params.nftModuleName
    }::${params.nftClassName}`,
    params.coinType ?? SUI_TYPE,
  ],
  arguments: [
    params.listing,
    params.inventory,
    params.isWhitelisted,
    params.price.toFixed(0),
  ],
  gasBudget: 5000,
});

export const buildSetLimtitedMarketNewLimitTx = (
  params: BuildSetLimitMarketLimitParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "limited_fixed_price",
  function: "set_limit",
  typeArguments: [params.coinType ?? SUI_TYPE],
  arguments: [params.listing, params.venue, params.newLimit.toFixed(0)],
  gasBudget: params.gasBudget ?? 5000,
});

export const buildInitLimitedVenueTx = (
  params: BuildInitLimitedVenueParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "limited_fixed_price",
  function: "init_venue",
  typeArguments: [
    `${params.collectionPackageId ?? params.packageObjectId}::${
      params.nftModuleName
    }::${params.nftClassName}`,
    params.coinType ?? SUI_TYPE,
  ],
  arguments: [
    params.listing,
    params.inventory,
    params.isWhitelisted,
    params.limit.toFixed(0),
    params.price.toFixed(0),
  ],
  gasBudget: 5000,
});

export const buildRequestToJoinMarketplaceTx = (
  params: BuildRequestToJoinMarketplaceParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "listing",
  function: "request_to_join_marketplace",
  typeArguments: [],
  arguments: [params.marketplace, params.listing],
  gasBudget: 5000,
});

export const buildAcceptListingRequestTx = (
  params: BuildAcceptListingRequest
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "listing",
  function: "accept_listing_request",
  typeArguments: [],
  arguments: [params.marketplace, params.listing],
  gasBudget: 5000,
});

export const buildEnableSalesTx = (
  params: BuildEnableSalesParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "listing",
  function: "sale_on",
  typeArguments: [],
  arguments: [params.listing, params.venue],
  gasBudget: 5000,
});

export const buildCreateFlatFeeTx = (
  params: BuildCreateFlatFeeParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "flat_fee",
  function: "init_fee",
  typeArguments: [],
  arguments: [params.rate.toFixed(0)],
  gasBudget: 5000,
});

export const buildInitMarketplaceTx = (
  params: BuildInitMarketplaceParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "marketplace",
  function: "init_marketplace",
  typeArguments: [`${params.packageObjectId}::flat_fee::FlatFee`],
  arguments: [params.admin, params.receiver, params.defaultFee],
  gasBudget: 5000,
});

export const buildInitListingTx = (
  params: BuildInitListingParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "listing",
  function: "init_listing",
  typeArguments: [],
  arguments: [params.listingAdmin, params.receiver],
  gasBudget: 5000,
});

export const buildInitWarehouseTx = (
  params: BuildInitWarehouseParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "warehouse",
  function: "init_warehouse",
  typeArguments: [
    `${params.collectionPackageId ?? params.packageObjectId}::${
      params.nftModuleName
    }::${params.nftClassName}`,
  ],
  arguments: [],
  gasBudget: 5000,
});

export const buildAddWarehouseToListingTx = (
  params: BuildAddWarehouseToListingParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "listing",
  function: "add_warehouse",
  typeArguments: [
    `${params.collectionPackageId ?? params.packageObjectId}::${
      params.nftModuleName
    }::${params.nftClassName}`,
  ],
  arguments: [params.listing, params.collection, params.warehouse],
  gasBudget: 50000,
});

export const buildIssueWhitelistCertificateTx = (
  params: BuildIsueWhitelistCertificateParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "market_whitelist",
  function: "issue",
  typeArguments: [],
  arguments: [params.listing, params.venue, params.recipient],
  gasBudget: 50000,
});
