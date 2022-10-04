import { NftClient } from '../src';

const getNfts = async () => {
  const client = new NftClient();
  const collection = await client.getCollectionsById({ objectIds: ['0xb34dd7ddc858edb53a35ae76e3c5abd020660dac'] });
  const nfts = await client.getNftsForAddress('0x0ec841965c95866d38fa7bcd09047f4e0dfa0ed9');
  console.log('nfts', collection, nfts);
};

getNfts();
