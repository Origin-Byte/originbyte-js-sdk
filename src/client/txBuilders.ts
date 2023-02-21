import { MoveCallTransaction } from "@mysten/sui.js";
import {
  BuildBuyNftParams,
  BuildInitWarehouseParams,
  BuildCreateFlatFeeParams,
  BuildEnableSalesParams,
  BuildInitMarketplaceParams,
  BuildInitListingParams,
  BuildMintNftParams,
  BuildCreateFixedPriceMarketParams,
  BuildInitVenueParams,
  BuildRequestToJoinMarketplaceParams,
  BuildAcceptListingRequest,
  BuildAddWarehouseToListingParams,
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
    gasBudget: 10000,
  };
};

export const buildBuyNftTx = (
  params: BuildBuyNftParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "fixed_price",
  function: "buy_nft",
  typeArguments: [
    `${params.packageObjectId}::${params.nftModuleName}::${params.nftClassName}`,
    SUI_TYPE,
  ],
  arguments: [params.listing, params.venue, params.coin],
  gasBudget: params.gasBudget ?? 5000,
});

export const buildInitVenueTx = (
  params: BuildInitVenueParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "fixed_price",
  function: "init_venue",
  typeArguments: [
    `${params.packageObjectId}::${params.nftModuleName}::${params.nftClassName}`,
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

export const buildInitFixedPriceMarketTx = (
  params: BuildCreateFixedPriceMarketParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "fixed_price",
  function: "init_market",
  typeArguments: [params.coinType ?? SUI_TYPE],
  arguments: [params.inventory, params.price.toFixed(0)],
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
    `${params.packageObjectId}::${params.nftModuleName}::${params.nftClassName}`,
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
    `${params.packageObjectId}::${params.nftModuleName}::${params.nftClassName}`,
  ],
  arguments: [params.listing, params.collection, params.warehouse],
  gasBudget: 50000,
});
