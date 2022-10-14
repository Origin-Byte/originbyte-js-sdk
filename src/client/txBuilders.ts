import { MoveCallTransaction } from '@mysten/sui.js';
import {
  BuildMintNftParams,
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
    module: 'suimarines',
    function: 'mint_nft',
    typeArguments: [],
    arguments: [
      params.index,
      params.name,
      params.description,
      params.url,
      keys.map((_) => strToByteArray(_)),
      values.map((_) => strToByteArray(_)),
      params.mintAuthority,
      params.saleIndex ?? 0,
      params.launchpadId,
    ],
    gasBudget: 5000,
  };
};
