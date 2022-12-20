import { MoveCallTransaction } from '@mysten/sui.js';
import {
  BuildBuyNftCertificateParams,
  BuildClaimNftCertificateParams,
  BuildCreateFixedPriceMarket,
  BuildCreateFlatFeeParams,
  BuildEnableSalesParams,
  BuildInitLaunchpadParams,
  BuildInitSlotParams, BuildMintNftParams,
} from './types';

export const biuldMintNft = (params: BuildMintNftParams): MoveCallTransaction => {
  // const keys: string[] = [];
  // const values: string[] = [];
  // const { attributes } = params;
  // Object.keys(attributes).forEach((key) => {
  //   keys.push(key);
  //   values.push(attributes[key]);
  // });

  return {
    packageObjectId: params.packageObjectId,
    module: params.moduleName,
    function: 'mint_nft',
    typeArguments: [],
    arguments: [
      params.name,
      params.description,
      // params.url,
      // keys.map((_) => strToByteArray(_)),
      // values.map((_) => strToByteArray(_)),
      params.mintCap,
      params.slot,
      params.marketId,
      // params.tierIndex ?? 0,
      // params.launchpadId,
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

export const buildCreateFixedPriceMarket = (params: BuildCreateFixedPriceMarket): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: 'fixed_price',
  function: 'init_market',
  typeArguments: [
    params.collectionType,
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
  module: 'launchpad',
  function: 'redeem_nft',
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
