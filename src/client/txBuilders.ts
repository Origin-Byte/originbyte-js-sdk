import { MoveCallTransaction } from '@mysten/sui.js';
import {
  BuildMintNftParams,
  BuildBuyNftCertificateParams,
  BuildEnableSalesParams,
  BuildClaimNftCertificateParams,
} from './types';
import { strToByteArray } from '../utils';

export const buildMintNftTx = (params: BuildMintNftParams): MoveCallTransaction => {
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
      keys.map((_) => strToByteArray(_)),
      values.map((_) => strToByteArray(_)),
      params.mintAuthority,
      params.tierIndex ?? 0,
      params.marketId,
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
    params.marketId,
    params.tierIndex ?? 0,
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
    params.marketId,
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
    params.marketId,
    params.nftId,
    params.certificateId,
    params.recepient,
  ],
  gasBudget: 5000,
});
