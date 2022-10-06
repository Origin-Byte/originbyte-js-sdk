import { MoveCallTransaction } from '@mysten/sui.js';
import { strToByteArray } from '../utils';
import {
  BuildBurnCollectionParams, BuildNftCollectionParams, BuildNftParams, BuildPrivateNftCollectionParams,
} from './types';

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

export const buildPrivatedCreateCollectionTransaction = (params: BuildPrivateNftCollectionParams): MoveCallTransaction => ({
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
  function: 'mint_and_transfer',
  typeArguments: [],
  arguments: [
    params.collectionId,
  ],
  gasBudget: 2000,
});
