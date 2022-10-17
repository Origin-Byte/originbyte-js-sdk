import { SuiMoveObject } from '@mysten/sui.js';
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
  NftType,
} from './types';
import { parseObjectOwner } from './utils';

// eslint-disable-next-line max-len
const ArtNftRegex = /(0x[a-f0-9]{40})::nft::Nft<0x[a-f0-9]{40}::([a-zA-Z]{1,})::([a-zA-Z]{1,}), 0x[a-f0-9]{40}::([a-zA-Z_]{1,}::[a-zA-Z_]{1,})>/;

export const ArtNftParser: SuiObjectParser<ArtNftRpcResponse, ArtNft> = {
  parser: (data, suiData, _) => {
    if (typeof _.details === 'object' && 'data' in _.details) {
      const { owner } = _.details;

      const matches = (suiData.data as SuiMoveObject).type.match(ArtNftRegex);
      if (!matches) {
        return undefined;
      }
      const packageObjectId = matches[1];
      const packageModule = matches[2];
      const packageModuleClassName = matches[3];
      const nftType = matches?.[4] as NftType;

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
        packageObjectId,
        packageModule,
        packageModuleClassName,
        nftType,
        rawResponse: _,
      };
    }
    return undefined;
  },
  regex: ArtNftRegex,
};

// eslint-disable-next-line max-len
const CollectionRegex = /(0x[a-f0-9]{40})::collection::Collection<0x[a-f0-9]{40}::([a-zA-Z_]{1,})::([a-zA-Z_]{1,}), 0x[a-f0-9]{40}::std_collection::StdMeta>/;

export const CollectionParser: SuiObjectParser<NftCollectionRpcResponse, NftCollection> = {
  parser: (data, suiData, _) => {
    const matches = (suiData.data as SuiMoveObject).type.match(CollectionRegex);
    if (!matches) {
      return undefined;
    }
    const packageObjectId = matches[1];
    const packageModule = matches[2];
    const packageModuleClassName = matches[3];

    return {
      name: data.name,
      description: data.description,
      creators: data.creators,
      symbol: data.symbol,
      receiver: data.receiver,
      type: suiData.data.dataType,
      id: suiData.reference.objectId,
      tags: data.tags.fields.enumerations.fields.contents.map((__) => __.fields.value),
      mintAuthorityId: data.mint_authority,
      packageObjectId,
      packageModule,
      packageModuleClassName,
      rawResponse: _,
    };
  },

  regex: CollectionRegex,
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
  regex: /0x[a-f0-9]{40}::collection::MintAuthority<0x[a-f0-9]{40}::[a-zA-Z_]{1,}::[a-zA-Z_]{1,}>/,
};

// eslint-disable-next-line max-len
export const FixedPriceMarketRegex = /(0x[a-f0-9]{40})::slingshot::Slingshot<0x[a-f0-9]{40}::([a-zA-Z_]{1,})::([a-zA-Z_]{1,}), 0x[a-f0-9]{40}::fixed_price::FixedPriceMarket>/;

export const FixedPriceMarketParser: SuiObjectParser<FixedPriceMarketRpcResponse, FixedPriceMarket> = {
  parser: (data, suiData, _) => {
    const matches = (suiData.data as SuiMoveObject).type.match(FixedPriceMarketRegex);
    if (!matches) {
      return undefined;
    }
    const packageObjectId = matches[1];
    const packageModule = matches[2];
    const packageModuleClassName = matches[3];

    return {
      id: suiData.reference.objectId,
      admin: data.admin,
      receiver: data.receiver,
      isEmbedded: data.is_embedded,
      collectionId: data.collection_id,
      live: data.live,
      packageObjectId,
      packageModule,
      packageModuleClassName,
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

  regex: FixedPriceMarketRegex,
};

const NftCertificateRegex = /(0x[a-f0-9]{40})::sale::NftCertificate/;
export const NftCertificateParser: SuiObjectParser<NftCertificateRpcResponse, NftCertificate> = {
  parser: (data, suiData, _) => {
    const matches = (suiData.data as SuiMoveObject).type.match(NftCertificateRegex);

    if (!matches) {
      return undefined;
    }
    const packageObjectId = matches[1];

    return {
      id: suiData.reference.objectId,
      nftId: data.nft_id,
      packageObjectId,
      marketId: data.launchpad_id,
      rawResponse: _,
      owner: parseObjectOwner(suiData.owner),
    };
  },
  regex: NftCertificateRegex,
};
