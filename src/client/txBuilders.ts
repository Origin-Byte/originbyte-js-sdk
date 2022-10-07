import { MoveCallTransaction } from '@mysten/sui.js';
import {
  BuildFixedPriceSlingshotParams,
  BuildMintToLaunchpadParams,
  BuildBurnCollectionParams,
  BuildNftCollectionParams,
  BuildNftParams,
  BuildPrivateNftCollectionParams,
  BuildBuyNftCertificateParams,
  BuildClaimNftParams,
} from './types';
import { strToByteArray } from '../utils';

export const buildCreateSharedCollectionTransaction = (params: BuildNftCollectionParams): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: 'std_collection',
  function: 'mint_and_share',
  typeArguments: [],
  arguments: [
    strToByteArray(params.name),
    strToByteArray(params.symbol),
    params.maxSupply,
    params.initialPrice,
    params.receiver,
    (params.tags || []).map(strToByteArray),
    params.royalty || 0,
    true,
    [],
  ],
  gasBudget: 5000,
});

export const buildCreatePrivateCollectionTransaction = (params: BuildPrivateNftCollectionParams): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: 'std_collection',
  function: 'mint_and_transfer',
  typeArguments: [],
  arguments: [
    strToByteArray(params.name),
    strToByteArray(params.symbol),
    params.maxSupply,
    params.initialPrice,
    params.receiver,
    (params.tags || []).map(strToByteArray),
    params.royalty || 0,
    true,
    [],
    params.recepient,
  ],
  gasBudget: 5000,
});

export const buildMintNftTransaction = (params: BuildNftParams): MoveCallTransaction => {
  const attributeKeys: number[][] = [];
  const attributeValues: number[][] = [];

  Object.keys(params.attributes).forEach((key) => {
    attributeKeys.push(strToByteArray(key));
    attributeValues.push(strToByteArray(params.attributes[key]));
  });

  return {
    packageObjectId: params.packageObjectId,
    module: 'std_nft',
    function: 'mint_and_transfer',
    typeArguments: [],
    arguments: [
      strToByteArray(params.name),
      strToByteArray(params.uri),
      false,
      attributeKeys,
      attributeValues,
      params.collectionId,
      params.coin,
      params.recepient,
    ],
    gasBudget: 2000,
  };
};

export const buildBurnCollectionTransaction = (params: BuildBurnCollectionParams): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: 'std_nft',
  function: 'burn',
  typeArguments: [],
  arguments: [
    params.collectionId,
  ],
  gasBudget: 2000,
});

export const buildCreateFixedPriceSlingshotTransaction = (params: BuildFixedPriceSlingshotParams): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: 'fixed_price',
  function: 'create',
  typeArguments: [
    `${params.packageObjectId}::std_collection::StdCollection`,
    `${params.packageObjectId}::std_collection::CollectionMeta`,
  ],
  arguments: [
    params.collectionId,
    params.admin,
    params.receiver,
    params.price,
  ],
  gasBudget: 2000,
});

export const buildBuyNftCertiicateTransaction = (params: BuildBuyNftCertificateParams): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: 'fixed_price',
  function: 'buy_nft_certificate',
  typeArguments: [
  ],
  arguments: [
    params.coin,
    params.launchpadId,
  ],
  gasBudget: 10000,
});

export const buildClaimNftTransaction = (params: BuildClaimNftParams): MoveCallTransaction => ({
  packageObjectId: params.packageObjectId,
  module: 'fixed_price',
  function: 'claim_nft',
  typeArguments: [
  ],
  arguments: [
    params.launchpadId,
    params.nft,
    params.certificate,
    params.recepient,
  ],
  gasBudget: 2000,
});

export const buildMintToLaunchpadTransaction = (params: BuildMintToLaunchpadParams): MoveCallTransaction => {
  const attributeKeys: number[][] = [];
  const attributeValues: number[][] = [];

  Object.keys(params.attributes).forEach((key) => {
    attributeKeys.push(strToByteArray(key));
    attributeValues.push(strToByteArray(params.attributes[key]));
  });

  return {
    packageObjectId: params.packageObjectId,
    module: 'std_nft',
    function: 'mint_to_launchpad',
    typeArguments: [
      `${params.packageObjectId}::fixed_price::FixedPriceSale`,
      `${params.packageObjectId}::fixed_price::LaunchpadConfig`,
    ],
    arguments: [
      params.name,
      params.url,
      params.isMutable,
      attributeKeys,
      attributeValues,
      params.collectionId,
      params.coin,
      params.launchpadId,
    ],
    gasBudget: 2000,
  };
};
