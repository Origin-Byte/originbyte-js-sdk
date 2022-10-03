import { JsonRpcProvider, MoveCallTransaction } from '@mysten/sui.js';
import { strToByteArray } from '../utils';
import {
  BuildNftParams, GetNftsParams, Nft, NftRpcResponse,
} from './types';

const TESTNET_URL = 'https://gateway.devnet.sui.io';

export const NFT_REGEX = /0x[a-f0-9]{40}::nft::NftOwned<0x[a-f0-9]{40}::std_nft::StdNft, 0x[a-f0-9]{40}::std_nft::NftMeta>/;

export class NftClient {
  private provider: JsonRpcProvider;

  constructor(_provider = new JsonRpcProvider(TESTNET_URL)) {
    this.provider = _provider;
  }

  getNftsById = async (params: GetNftsParams) => {
    const objects = await this.provider.getObjectBatch(params.objectIds);

    const nfts = objects
      .filter((_) => _.status === 'Exists')
      .map((_) => {
        if (typeof _.details === 'object' && 'data' in _.details && 'fields' in _.details.data && _.details.data.type.match(NFT_REGEX)) {
          const data = _.details.data.fields as NftRpcResponse;

          const { owner } = _.details;
          let ownerAddress = '';

          if (typeof owner === 'object') {
            if ('AddressOwner' in owner) {
              ownerAddress = owner.AddressOwner;
            }
            if ('ObjectOwner' in owner) {
              ownerAddress = owner.ObjectOwner;
            }
            if ('SingleOwner' in owner) {
              ownerAddress = owner.SingleOwner;
            }
          }
          return {
            name: data.metadata.fields.name,
            collectionId: data.collection_id,
            attributes: data.metadata.fields.attributes.fields.keys.reduce((acc, key, index) => {
              acc[key] = data.metadata.fields.attributes.fields.values[index];
              return acc;
            }, {} as { [c: string]: string }),
            url: data.metadata.fields.url,
            owner,
            ownerAddress,
            type: _.details.data.type,
          };
        }
        return undefined;
      }).filter((_): _ is Nft => !!_);

    return nfts;
  }

  getNftsForAddress = async (address: string) => {
    const objectsForWallet = await this.provider.getObjectsOwnedByAddress(address);
    const objectIds = objectsForWallet
      .filter((_) => _.type.match(NFT_REGEX))
      .map((_) => _.objectId);

    return this.getNftsById({ objectIds });
  }

  buildMintNftTransaction = (params: BuildNftParams): MoveCallTransaction => {
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
  }
}
