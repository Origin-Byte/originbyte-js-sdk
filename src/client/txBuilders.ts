import { txObj } from "../transaction";
import {
  BuildAcceptListingRequest,
  BuildAddWarehouseToListingParams,
  BuildBuyNftParams,
  BuildBuyWhitelistedNftParams,
  BuildCreateFlatFeeParams,
  BuildEnableSalesParams,
  BuildInitLimitedVenueParams,
  BuildInitListingParams,
  BuildInitMarketplaceParams,
  BuildInitVenueParams,
  BuildInitWarehouseParams,
  BuildIsueWhitelistCertificateParams,
  BuildMintNftParams,
  BuildRequestToJoinMarketplaceParams,
  BuildSetLimitMarketLimitParams,
} from "./types";

const SUI_TYPE = "0x2::sui::SUI";

export const buildMintNftTx = (params: BuildMintNftParams) => {
  const keys: string[] = [];
  const values: string[] = [];
  const { attributes } = params;
  Object.keys(attributes).forEach((key) => {
    keys.push(key);
    values.push(attributes[key]);
  });

  return txObj(
    {
      packageObjectId: params.packageObjectId,
      moduleName: params.moduleName,
      fun: "mint_nft",
      transaction: params.transaction,
    },
    (tx) => [
      tx.pure(params.name),
      tx.pure(params.description),
      tx.pure(params.url),
      tx.pure(keys),
      tx.pure(values),
      tx.object(params.mintCap),
      tx.object(params.warehouseId),
    ],
    []
  );
};

export const buildBuyNftTx = (params: BuildBuyNftParams) => {
  return txObj(
    {
      packageObjectId: params.collectionPackageId ?? params.packageObjectId,
      moduleName: params.module ?? "fixed_price",
      fun: "buy_nft",
      transaction: params.transaction,
    },
    (tx) => [
      tx.object(params.listing),
      tx.object(params.venue),
      tx.object(params.coin),
    ],
    [params.nftType, params.coinType ?? SUI_TYPE]
  );
};

export const buildBuyWhitelistedNftTx = (
  params: BuildBuyWhitelistedNftParams
) => {
  return txObj(
    {
      packageObjectId: params.collectionPackageId ?? params.packageObjectId,
      moduleName: params.module ?? "fixed_price",
      fun: "buy_whitelisted_nft",
      transaction: params.transaction,
    },
    (tx) => [
      tx.object(params.listing),
      tx.object(params.venue),
      tx.object(params.coin),
      tx.object(params.whitelistCertificate),
    ],
    [params.nftType, params.coinType ?? SUI_TYPE]
  );
};

export const buildInitVenueTx = (params: BuildInitVenueParams) => {
  return txObj(
    {
      packageObjectId: params.packageObjectId,
      moduleName: "fixed_price",
      fun: "init_venue",
      transaction: params.transaction,
    },
    (tx) => [
      tx.object(params.listing),
      tx.object(params.inventory),
      tx.pure(params.isWhitelisted),
      tx.pure(params.price),
    ],
    [params.nftType, params.coinType ?? SUI_TYPE]
  );
};

export const buildSetLimtitedMarketNewLimitTx = (
  params: BuildSetLimitMarketLimitParams
) => {
  return txObj(
    {
      packageObjectId: params.packageObjectId,
      moduleName: "limited_fixed_price",
      fun: "set_limit",
      transaction: params.transaction,
    },
    (tx) => [
      tx.object(params.listing),
      tx.object(params.venue),
      tx.pure(params.newLimit),
    ],
    [params.coinType ?? SUI_TYPE]
  );
};

export const buildInitLimitedVenueTx = (
  params: BuildInitLimitedVenueParams
) => {
  return txObj(
    {
      packageObjectId: params.packageObjectId,
      moduleName: "limited_fixed_price",
      fun: "init_venue",
      transaction: params.transaction,
    },
    (tx) => [
      tx.object(params.listing),
      tx.object(params.inventory),
      tx.pure(params.isWhitelisted),
      tx.pure(params.limit),
      tx.pure(params.price),
    ],
    [params.nftType, params.coinType ?? SUI_TYPE]
  );
};

export const buildRequestToJoinMarketplaceTx = (
  params: BuildRequestToJoinMarketplaceParams
) => {
  return txObj(
    {
      packageObjectId: params.packageObjectId,
      moduleName: "listing",
      fun: "request_to_join_marketplace",
    },
    (tx) => [tx.object(params.marketplace), tx.object(params.listing)],
    []
  );
};

export const buildAcceptListingRequestTx = (
  params: BuildAcceptListingRequest
) => {
  return txObj(
    {
      packageObjectId: params.packageObjectId,
      moduleName: "listing",
      fun: "accept_listing_request",
    },
    (tx) => [tx.object(params.marketplace), tx.object(params.listing)],
    []
  );
};

export const buildEnableSalesTx = (params: BuildEnableSalesParams) => {
  return txObj(
    {
      packageObjectId: params.packageObjectId,
      moduleName: "listing",
      fun: "sale_on",
    },
    (tx) => [tx.object(params.listing), tx.object(params.venue)],
    []
  );
};

export const buildDisableSalesTx = (params: BuildEnableSalesParams) => {
  return txObj(
    {
      packageObjectId: params.packageObjectId,
      moduleName: "listing",
      fun: "sale_off",
    },
    (tx) => [tx.object(params.listing), tx.object(params.venue)],
    []
  );
};

export const buildCreateFlatFeeTx = (params: BuildCreateFlatFeeParams) => {
  return txObj(
    {
      packageObjectId: params.packageObjectId,
      moduleName: "flat_fee",
      fun: "init_fee",
    },
    (tx) => [tx.pure(params.rate)],
    []
  );
};

export const buildInitMarketplaceTx = (params: BuildInitMarketplaceParams) => {
  return txObj(
    {
      packageObjectId: params.packageObjectId,
      moduleName: "marketplace",
      fun: "init_marketplace",
    },
    (tx) => [
      tx.object(params.admin),
      tx.object(params.receiver),
      tx.object(params.defaultFee),
    ],
    [params.feeType ?? `${params.packageObjectId}::flat_fee::FlatFee`]
  );
};

export const buildInitListingTx = (params: BuildInitListingParams) => {
  return txObj(
    {
      packageObjectId: params.packageObjectId,
      moduleName: "listing",
      fun: "init_listing",
    },
    (tx) => [tx.object(params.listingAdmin), tx.object(params.receiver)],
    []
  );
};

export const buildInitWarehouseTx = (params: BuildInitWarehouseParams) => {
  return txObj(
    {
      packageObjectId: params.packageObjectId,
      moduleName: "warehouse",
      fun: "init_warehouse",
    },
    () => [],
    [params.nftType]
  );
};

export const buildAddWarehouseToListingTx = (
  params: BuildAddWarehouseToListingParams
) => {
  return txObj(
    {
      packageObjectId: params.packageObjectId,
      moduleName: "listing",
      fun: "add_warehouse",
    },
    (tx) => [tx.object(params.listing), tx.object(params.warehouse)],
    [params.nftType]
  );
};

export const buildIssueWhitelistCertificateTx = (
  params: BuildIsueWhitelistCertificateParams
) => {
  return txObj(
    {
      packageObjectId: params.packageObjectId,
      moduleName: "market_whitelist",
      fun: "issue",
    },
    (tx) => [
      tx.object(params.listing),
      tx.object(params.venue),
      tx.object(params.recipient),
    ],
    []
  );
};
