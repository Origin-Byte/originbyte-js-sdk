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
    gasBudget: 5000,
  };
};

export const buildBuyNftCertificate = (params: BuildBuyNftCertificateParams): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: 'fixed_price',
  function: 'buy_nft_certificate',
  typeArguments: [
    params.collectionType,
  ],
  arguments: [
    params.wallet,
    params.launchpadId,
    params.tierIndex ?? 0,
  ],
  gasBudget: 5000,
});

export const buildCreateFixedPriceMarket = (params: BuildCreateFixedPriceMarket): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: 'fixed_price',
  function: 'create_market',
  typeArguments: [],
  arguments: [
    params.launchpad,
    params.slot,
    params.isWhitelisted,
    params.price,
  ],
  gasBudget: 5000,
});

export const buildEnableSales = (params: BuildEnableSalesParams): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: 'fixed_price',
  function: 'sale_on',
  typeArguments: [
    params.collectionType,
  ],
  arguments: [
    params.launchpadId,
  ],
  gasBudget: 5000,
});

export const buildClaimNftCertificate = (params: BuildClaimNftCertificateParams): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: 'slingshot',
  function: 'claim_nft_embedded',
  typeArguments: [
    params.collectionType,
    `${params.packageObjectId}::fixed_price::FixedPriceMarket`,
    `${params.packageObjectId}::${params.nftType}`,
  ],
  arguments: [
    params.launchpadId,
    params.nftId,
    params.certificateId,
    params.recepient,
  ],
  gasBudget: 5000,
});

export const buildCreateFlatFee = (params: BuildCreateFlatFeeParams): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: 'flat_fee',
  function: 'create',
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
  typeArguments: [],
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
  module: 'launchpad',
  function: 'init_slot',
  typeArguments: [],
  arguments: [
    params.launchpad,
    params.slotAdmin,
    params.receiver,
  ],
  gasBudget: 5000,
});
