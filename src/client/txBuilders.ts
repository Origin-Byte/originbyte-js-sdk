import { TransactionBlock } from "@mysten/sui.js";
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

export const buildMintNftTx = (
  params: BuildMintNftParams
): TransactionBlock => {
  const keys: string[] = [];
  const values: string[] = [];
  const { attributes } = params;
  Object.keys(attributes).forEach((key) => {
    keys.push(key);
    values.push(attributes[key]);
  });

  const tx = params.transaction ?? new TransactionBlock();

  tx.moveCall({
    target: `${params.packageObjectId}::${params.moduleName}::mint_nft`,
    arguments: [
      tx.pure(params.name),
      tx.pure(params.description),
      tx.pure(params.url),
      tx.pure(keys),
      tx.pure(values),
      tx.object(params.mintCap),
      tx.object(params.warehouseId),
    ],
  });

  return tx;
};

export const buildBuyNftTx = (
  params: BuildBuyNftParams
): TransactionBlock => {
  const tx = params.transaction ?? new TransactionBlock();

  tx.moveCall({
    target: `${params.packageObjectId}::${params.module ?? "fixed_price"}::buy_nft`,
    typeArguments: [
      `${params.collectionPackageId ?? params.packageObjectId}::${params.nftModuleName
      }::${params.nftClassName}`,
      params.coinType ?? SUI_TYPE,
    ],
    arguments: [
      tx.object(params.listing),
      tx.object(params.venue),
      tx.object(params.coin),
    ]
    ,
  });

  return tx;
}

export const buildBuyWhitelistedNftTx = (
  params: BuildBuyWhitelistedNftParams
): TransactionBlock => {
  const tx = params.transaction ?? new TransactionBlock();

  tx.moveCall({
    target: `${params.packageObjectId}::${params.module ?? "fixed_price"}::buy_whitelisted_nft`,
    typeArguments: [
      `${params.collectionPackageId ?? params.packageObjectId}::${params.nftModuleName
      }::${params.nftClassName}`,
      params.coinType ?? SUI_TYPE,
    ],
    arguments: [
      tx.object(params.listing),
      tx.object(params.venue),
      tx.object(params.coin),
      tx.object(params.whitelistCertificate),
    ]
    ,
  });

  return tx;
};

export const buildInitVenueTx = (
  params: BuildInitVenueParams
): TransactionBlock => {

  const tx = params.transaction ?? new TransactionBlock();
  tx.moveCall({
    target: `${params.packageObjectId}::fixed_price::init_venue`,
    typeArguments: [
      `${params.collectionPackageId ?? params.packageObjectId}::${params.nftModuleName
      }::${params.nftClassName}`,
      params.coinType ?? SUI_TYPE,
    ],
    arguments: [
      tx.object(params.listing),
      tx.object(params.inventory),
      tx.pure(params.isWhitelisted),
      tx.pure(params.price),
    ],
  });

  return tx;
};

export const buildSetLimtitedMarketNewLimitTx = (
  params: BuildSetLimitMarketLimitParams
): TransactionBlock => {

  const tx = params.transaction ?? new TransactionBlock();

  tx.moveCall({
    target: `${params.packageObjectId}::limited_fixed_price::set_limit`,
    typeArguments: [
      params.coinType ?? SUI_TYPE,
    ],
    arguments: [
      tx.object(params.listing),
      tx.object(params.venue),
      tx.pure(params.newLimit),
    ],
  });

  return tx;
};

export const buildInitLimitedVenueTx = (
  params: BuildInitLimitedVenueParams
): TransactionBlock => {
  const tx = params.transaction ?? new TransactionBlock();

  tx.moveCall({
    target: `${params.packageObjectId}::limited_fixed_price::init_venue`,
    typeArguments: [
      `${params.collectionPackageId ?? params.packageObjectId}::${params.nftModuleName
      }::${params.nftClassName}`,
      params.coinType ?? SUI_TYPE,
    ],
    arguments: [
      tx.object(params.listing),
      tx.object(params.inventory),
      tx.pure(params.isWhitelisted),
      tx.pure(params.limit),

      tx.pure(params.price),
    ],
  });

  return tx;
};

export const buildRequestToJoinMarketplaceTx = (
  params: BuildRequestToJoinMarketplaceParams
): TransactionBlock => {
  const tx = params.transaction ?? new TransactionBlock();

  tx.moveCall({
    target: `${params.packageObjectId}::listing::request_to_join_marketplace`,
    arguments: [
      tx.object(params.marketplace),
      tx.object(params.listing),
    ],
  });

  return tx;
};

export const buildAcceptListingRequestTx = (
  params: BuildAcceptListingRequest
): TransactionBlock => {
  const tx = params.transaction ?? new TransactionBlock();

  tx.moveCall({
    target: `${params.packageObjectId}::listing::accept_listing_request`,
    arguments: [
      tx.object(params.marketplace),
      tx.object(params.listing),
    ],
  });

  return tx;
}

export const buildEnableSalesTx = (
  params: BuildEnableSalesParams
): TransactionBlock => {
  const tx = params.transaction ?? new TransactionBlock();

  tx.moveCall({
    target: `${params.packageObjectId}::listing::enable_sales`,
    arguments: [
      tx.object(params.listing),
      tx.object(params.venue),
    ],
  });

  return tx;
}

export const buildCreateFlatFeeTx = (
  params: BuildCreateFlatFeeParams
): TransactionBlock => {
  const tx = params.transaction ?? new TransactionBlock();

  tx.moveCall({
    target: `${params.packageObjectId}::flat_fee::init_fee`,
    arguments: [
      tx.pure(params.rate),
    ],
  });

  return tx;
};

export const buildInitMarketplaceTx = (
  params: BuildInitMarketplaceParams
): TransactionBlock => {
  const tx = params.transaction ?? new TransactionBlock();

  tx.moveCall({
    target: `${params.packageObjectId}::marketplace::init_marketplace`,
    typeArguments: [`${params.packageObjectId}::flat_fee::FlatFee`],
    arguments: [
      tx.object(params.admin),
      tx.object(params.receiver),
      tx.pure(params.defaultFee),
    ],
  });

  return tx;
}

export const buildInitListingTx = (
  params: BuildInitListingParams
): TransactionBlock => {
  const tx = params.transaction ?? new TransactionBlock();

  tx.moveCall({
    target: `${params.packageObjectId}::listing::init_listing`,
    arguments: [
      tx.object(params.listingAdmin),
      tx.object(params.receiver),
    ],
  });

  return tx;
}

export const buildInitWarehouseTx = (
  params: BuildInitWarehouseParams
): TransactionBlock => {
  const tx = params.transaction ?? new TransactionBlock();

  tx.moveCall({
    target: `${params.packageObjectId}::warehouse::init_warehouse`,
    typeArguments: [
      `${params.collectionPackageId ?? params.packageObjectId}::${params.nftModuleName
      }::${params.nftClassName}`,
    ],
  });

  return tx;
}

export const buildAddWarehouseToListingTx = (
  params: BuildAddWarehouseToListingParams
): TransactionBlock => {
  const tx = params.transaction ?? new TransactionBlock();

  tx.moveCall({
    target: `${params.packageObjectId}::listing::add_warehouse`,
    typeArguments: [
      `${params.collectionPackageId ?? params.packageObjectId}::${params.nftModuleName
      }::${params.nftClassName}`,
    ],
    arguments: [
      tx.object(params.listing),
      tx.object(params.collection),
      tx.object(params.warehouse),
    ],
  });

  return tx;
}

export const buildIssueWhitelistCertificateTx = (
  params: BuildIsueWhitelistCertificateParams
): TransactionBlock => {
  const tx = params.transaction ?? new TransactionBlock();

  tx.moveCall({
    target: `${params.packageObjectId}::market_whitelist::issue`,
    arguments: [
      tx.object(params.listing),
      tx.object(params.venue),
      tx.object(params.recipient),
    ],
  });

  return tx;
}
