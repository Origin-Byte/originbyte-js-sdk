import { JsonRpcProvider } from '@mysten/sui.js';
import { toMap } from '../utils';
import { ArtNftParser, CollectionParser } from './parsers';
import {
  buildBurnCollectionTransaction, buildCreateSharedCollectionTransaction,
  buildMintNftTransaction,
  buildPrivatedCreateCollectionTransaction,
} from './txBuilders';
import {
  ArtNftWithCollection,
  GetCollectionsParams,
  GetNftsParams, SuiObjectParser,
} from './types';
import { isObjectExists } from './utils';

const TESTNET_URL = 'https://gateway.devnet.sui.io';

export class NftClient {
  private provider: JsonRpcProvider;

  constructor(_provider = new JsonRpcProvider(TESTNET_URL)) {
    this.provider = _provider;
  }

  private fetchObjectIdsForAddress =
    async <RpcResponse, DataModel>(address: string, parser: SuiObjectParser<RpcResponse, DataModel>): Promise<string[]> => {
      const objectsForWallet = await this.provider.getObjectsOwnedByAddress(address);
      return objectsForWallet
        .filter((_) => _.type.match(parser.regex))
        .map((_) => _.objectId);
    }

  private fetchAndParseObjectsById = async <RpcResponse, DataModel>(
    ids: string[], parser: SuiObjectParser<RpcResponse, DataModel>): Promise<DataModel[]> => {
    const objects = await this.provider.getObjectBatch(ids);

    const parsedObjects = objects
      .filter(isObjectExists)
      .map((_) => {
        if (typeof _.details === 'object' && 'data' in _.details && 'fields' in _.details.data && _.details.data.type.match(parser.regex)) {
          return parser.parser(_.details.data.fields as RpcResponse, _.details, _);
        }
        return undefined;
      })
      .filter((_): _ is DataModel => !!_);

    return parsedObjects;
  }

  private fetchAndParseObjectsForAddress =
    async <RpcResponse, DataModel>(address: string, parser: SuiObjectParser<RpcResponse, DataModel>) => {
      const objectIds = await this.fetchObjectIdsForAddress(address, parser);
      return this.fetchAndParseObjectsById(objectIds, parser);
    }

  getCollectionsById = async (params: GetCollectionsParams) => {
    return this.fetchAndParseObjectsById(params.objectIds, CollectionParser);
  }

  getCollectionsForAddress = async (address: string) => {
    return this.fetchAndParseObjectsForAddress(address, CollectionParser);
  }

  getNftsById = async (params: GetNftsParams): Promise<ArtNftWithCollection[]> => {
    const nfts = await this.fetchAndParseObjectsById(params.objectIds, ArtNftParser);
    const collectionIds = nfts.map((_) => _.collectionId);
    const collections = await this.getCollectionsById({ objectIds: collectionIds });
    const collectionById = toMap(collections, (_) => _.id);

    return nfts.map((nft) => {
      const collection = collectionById.get(nft.collectionId);
      return {
        data: nft,
        collection,
      };
    });
  }

  getNftsForAddress = async (address: string) => {
    const objectIds = await this.fetchObjectIdsForAddress(address, ArtNftParser);
    return this.getNftsById({ objectIds });
  }

  buildCreateSharedCollectionTransaction = buildCreateSharedCollectionTransaction

  buildPrivatedCreateCollectionTransaction = buildPrivatedCreateCollectionTransaction

  buildMintNftTransaction = buildMintNftTransaction

  buildBurnCollectionTransaction = buildBurnCollectionTransaction
}
