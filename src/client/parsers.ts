import {
  ArtNft,
  NftCollection,
  NftCollectionRpcResponse,
  ArtNftRpcResponse,
  SuiObjectParser,
} from './types';

export const ArtNftParser: SuiObjectParser<ArtNftRpcResponse, ArtNft> = {
  parser: (data, suiData, _) => {
    if (typeof _.details === 'object' && 'data' in _.details) {
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
        type: suiData.data.dataType,
        rawResponse: _,
      };
    }
    return undefined;
  },
  regex: /0x[a-f0-9]{40}::nft::NftOwned<0x[a-f0-9]{40}::std_nft::StdNft, 0x[a-f0-9]{40}::std_nft::NftMeta>/,
};

export const CollectionParser: SuiObjectParser<NftCollectionRpcResponse, NftCollection> = {
  parser: (data, suiData, _) => ({
    name: data.name,
    symbol: data.symbol,
    currentSupply: data.current_supply,
    totalSupply: data.total_supply,
    initialPrice: data.initial_price,
    receiver: data.receiver,
    type: suiData.data.dataType,
    id: data.id.id,
    rawResponse: _,
  }),
  // eslint-disable-next-line max-len
  regex: /0x[a-f0-9]{40}::collection::Collection<0x[a-f0-9]{40}::std_collection::StdCollection, 0x[a-f0-9]{40}::std_collection::CollectionMeta>/,
};
