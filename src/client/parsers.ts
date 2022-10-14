import {
  ArtNft,
  NftCollection,
  NftCollectionRpcResponse,
  ArtNftRpcResponse,
  SuiObjectParser,
  MintAuthority,
  MintAuthorityRPCResponse,
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
        id: data.id.id,
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
    description: data.description,
    creators: data.creators,
    symbol: data.symbol,
    // currentSupply: data.cap.fields.supply.fields.current,
    // totalSupply: data.cap.fields.supply.fields.cap,
    receiver: data.receiver,
    type: suiData.data.dataType,
    id: suiData.reference.objectId,
    tags: data.tags.fields.enumerations.fields.contents.map((__) => __.fields.value),
    mintAuthorityId: data.mint_authority,
    rawResponse: _,
  }),
  // eslint-disable-next-line max-len
  regex: /0x[a-f0-9]{40}::collection::Collection<0x[a-f0-9]{40}::[a-zA-Z]{1,}::[a-zA-Z]{1,}, 0x[a-f0-9]{40}::std_collection::StdMeta>/,
};

export const MintAuthorityParser: SuiObjectParser<MintAuthorityRPCResponse, MintAuthority> = {
  parser: (data, suiData, _) => ({
    id: suiData.reference.objectId,
    collectionId: data.collection_id,
    isBlind: data.supply_policy.fields.is_blind,
    currentSupply: data.supply_policy.fields.supply.fields.current,
    maxSupply: data.supply_policy.fields.supply.fields.max,
    frozen: data.supply_policy.fields.supply.fields.frozen,
    rawResponse: _,
  }),
  // eslint-disable-next-line max-len
  regex: /0x[a-f0-9]{40}::collection::MintAuthority<0x[a-f0-9]{40}::[a-zA-Z]{1,}::[a-zA-Z]{1,}>/,
};
