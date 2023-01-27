import { MoveCallTransaction } from "@mysten/sui.js";
import {
  BuildBuyNftParams,
  BuildCreateFixedPriceMarketOnInventoryParams,
  BuildInitInventoryParams,
  BuildCreateFlatFeeParams,
  BuildEnableSalesParams,
  BuildInitMarketplaceParams,
  BuildInitListingParams,
  BuildMintNftParams,
  BuildCreateFixedPriceMarketParams,
  BuildCreateFixedPriceMarketOnListingParams,
  BuildRequestToJoinMarketplaceParams,
  BuildAcceptListingRequest,
  BuildAddInventoryToListingParams,
} from "./types";

const SUI_TYPE = "0x2::sui::SUI";
export const biuldMintNft = (
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
      params.inventoryId,
    ],
    gasBudget: 10000,
  };
};

export const buildBuyNft = (
  params: BuildBuyNftParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "fixed_price",
  function: "buy_nft",
  typeArguments: [
    `${params.packageObjectId}::${params.nftModuleName}::${params.nftClassName}`,
    SUI_TYPE,
  ],
  arguments: [params.listing, params.inventory, params.market, params.coin],
  gasBudget: 5000,
});

export const buildCreateFixedPriceMarketOnInventory = (
  params: BuildCreateFixedPriceMarketOnInventoryParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "fixed_price",
  function: "create_market_on_inventory",
  typeArguments: [params.coinType ?? SUI_TYPE],
  arguments: [params.inventory, params.isWhitelisted, params.price.toFixed(0)],
  gasBudget: 5000,
});

export const buildCreateFixedPriceMarketOnListing = (
  params: BuildCreateFixedPriceMarketOnListingParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "fixed_price",
  function: "create_market_on_listing",
  typeArguments: [params.coinType ?? SUI_TYPE],
  arguments: [
    params.listing,
    params.inventory,
    params.isWhitelisted,
    params.price.toFixed(0),
  ],
  gasBudget: 5000,
});

export const buildRequestToJoinMarketplace = (
  params: BuildRequestToJoinMarketplaceParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "listing",
  function: "request_to_join_marketplace",
  typeArguments: [],
  arguments: [params.marketplace, params.listing],
  gasBudget: 5000,
});

export const buildAcceptListingRequest = (
  params: BuildAcceptListingRequest
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "listing",
  function: "accept_listing_request",
  typeArguments: [],
  arguments: [params.marketplace, params.listing],
  gasBudget: 5000,
});

export const buildInitFixedPriceMarket = (
  params: BuildCreateFixedPriceMarketParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "fixed_price",
  function: "init_market",
  typeArguments: [params.coinType ?? SUI_TYPE],
  arguments: [params.price.toFixed(0)],
  gasBudget: 5000,
});

export const buildEnableSales = (
  params: BuildEnableSalesParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "listing",
  function: "sale_on",
  typeArguments: [],
  arguments: [params.listing, params.inventory, params.market],
  gasBudget: 5000,
});

export const buildCreateFlatFee = (
  params: BuildCreateFlatFeeParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "flat_fee",
  function: "init_fee",
  typeArguments: [],
  arguments: [params.rate.toFixed(0)],
  gasBudget: 5000,
});

export const buildInitMarketplace = (
  params: BuildInitMarketplaceParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "marketplace",
  function: "init_marketplace",
  typeArguments: [`${params.packageObjectId}::flat_fee::FlatFee`],
  arguments: [params.admin, params.receiver, params.defaultFee],
  gasBudget: 5000,
});

export const buildInitListing = (
  params: BuildInitListingParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "listing",
  function: "init_listing",
  typeArguments: [],
  arguments: [params.listingAdmin, params.receiver],
  gasBudget: 5000,
});

export const buildInitInventoryTx = (
  params: BuildInitInventoryParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "inventory",
  function: "init_inventory",
  typeArguments: [],
  arguments: [],
  gasBudget: 5000,
});

export const buildAddInventoryToListing = (
  params: BuildAddInventoryToListingParams
): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: "listing",
  function: "add_inventory",
  typeArguments: [],
  arguments: [params.listing, params.inventory],
  gasBudget: 50000,
});
