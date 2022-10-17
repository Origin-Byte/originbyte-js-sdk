import {
  ArtNft,
  NftCollection,
  NftCollectionRpcResponse,
  ArtNftRpcResponse,
  SuiObjectParser,
  MintAuthority,
  MintAuthorityRPCResponse,
  FixedPriceMarket,
  FixedPriceMarketRpcResponse,
  NftCertificate,
  NftCertificateRpcResponse,
} from './types';
import { parseObjectOwner } from './utils';

export const ArtNftParser: SuiObjectParser<ArtNftRpcResponse, ArtNft> = {
  parser: (data, suiData, _) => {
    if (typeof _.details === 'object' && 'data' in _.details) {
      const { owner } = _.details;

      return {
        name: data.data.fields.name,
        collectionId: data.data.fields.collection_id,
        attributes: data.data.fields.attributes.fields.keys.reduce((acc, key, index) => {
          acc[key] = data.data.fields.attributes.fields.values[index];
          return acc;
        }, {} as { [c: string]: string }),
        url: data.data.fields.url,
        owner,
        ownerAddress: parseObjectOwner(owner),
        type: suiData.data.dataType,
        id: _.details.reference.objectId,
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

export const FixedPriceMarketParser: SuiObjectParser<FixedPriceMarketRpcResponse, FixedPriceMarket> = {
  parser: (data, suiData, _) => {
    return {
      id: suiData.reference.objectId,
      admin: data.admin,
      receiver: data.receiver,
      isEmbedded: data.is_embedded,
      live: data.live,
      rawResponse: _,
      sales: data.sales.map((sale) => ({
        marketPrice: sale.fields.market.fields.price,
        nfts: sale.fields.nfts,
        queue: sale.fields.queue,
        tierIndex: sale.fields.tier_index,
        whitelisted: sale.fields.whitelisted,
      })),
    };
  },
  // eslint-disable-next-line max-len
  regex: /0x[a-f0-9]{40}::slingshot::Slingshot<0x[a-f0-9]{40}::[a-zA-Z]{1,}::[a-zA-Z]{1,}, 0x6b293ee296cbbfa75248fdfa883150141048817d::fixed_price::FixedPriceMarket>/,
};

export const NftCertificateParser: SuiObjectParser<NftCertificateRpcResponse, NftCertificate> = {
  parser: (data, suiData, _) => {
    return {
      id: suiData.reference.objectId,
      nftId: data.nft_id,
      rawResponse: _,
      owner: parseObjectOwner(suiData.owner),
    };
  },
  regex: /0x[a-f0-9]{40}::sale::NftCertificate/,
};
