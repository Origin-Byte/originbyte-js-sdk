import { MoveCallTransaction } from '@mysten/sui.js';
import {
  BuildBuyNftCertificateParams,
  BuildClaimNftCertificateParams,
  BuildCreateFixedPriceMarketWithInventoryParams,
  BuildCreateInventoryParams,
  BuildCreateFlatFeeParams,
  BuildEnableSalesParams,
  BuildInitLaunchpadParams,
  BuildInitSlotParams,
  BuildMintNftParams,
  BuildCreateFixedPriceMarketParams,
} from './types';

export const biuldMintNft = (params: BuildMintNftParams): MoveCallTransaction => {
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
    function: 'mint_nft',
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

export const buildBuyNftCertificate = (params: BuildBuyNftCertificateParams): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: 'fixed_price',
  function: 'buy_nft_certificate',
  typeArguments: [
    '0x2::sui::SUI',
  ],
  arguments: [
    params.launchpadId,
    params.slotId,
    params.marketId,
    params.coin,
  ],
  gasBudget: 5000,
});

export const buildCreateFixedPriceMarketWithInventory = (params: BuildCreateFixedPriceMarketWithInventoryParams): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: 'fixed_price',
  function: 'init_market_with_inventory',
  typeArguments: [
    '0x2::sui::SUI',
  ],
  arguments: [
    params.slot,
    params.inventoryId,
    params.price,
  ],
  gasBudget: 5000,
});

export const buildCreateFixedPriceMarket = (params: BuildCreateFixedPriceMarketParams): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: 'fixed_price',
  function: 'init_market',
  typeArguments: [
    '0x2::sui::SUI',
  ],
  arguments: [
    params.slot,
    params.isWhitelisted,
    params.price,
  ],
  gasBudget: 5000,
});

export const buildEnableSales = (params: BuildEnableSalesParams): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: 'slot',
  function: 'sale_on',
  typeArguments: [],
  arguments: [
    params.slotId,
  ],
  gasBudget: 5000,
});

export const buildClaimNftCertificate = (params: BuildClaimNftCertificateParams): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: 'slot',
  function: 'transfer_nft',
  typeArguments: [
    params.nftType,
  ],
  arguments: [
    params.certificateId,
    params.slotId,
    params.recepient,
  ],
  gasBudget: 5000,
});

export const buildCreateFlatFee = (params: BuildCreateFlatFeeParams): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: 'flat_fee',
  function: 'init_fee',
  typeArguments: [],
  arguments: [
    params.rate,
  ],
  gasBudget: 5000,
});

export const buildInitLaunchpad = (params: BuildInitLaunchpadParams): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: 'launchpad',
  function: 'init_launchpad',
  typeArguments: [
    `${params.packageObjectId}::flat_fee::FlatFee`,
  ],
  arguments: [
    params.admin,
    params.receiver,
    params.autoApprove,
    params.defaultFee,
  ],
  gasBudget: 5000,
});

export const buildInitSlot = (params: BuildInitSlotParams): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: 'slot',
  function: 'init_slot',
  typeArguments: [],
  arguments: [
    params.launchpad,
    params.slotAdmin,
    params.receiver,
  ],
  gasBudget: 5000,
});

export const buildCreateInventoryTx = (params: BuildCreateInventoryParams): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: 'inventory',
  function: 'create_and_transfer',
  typeArguments: [],
  arguments: [
    params.isWhitelisted,
  ],
  gasBudget: 5000,
});
