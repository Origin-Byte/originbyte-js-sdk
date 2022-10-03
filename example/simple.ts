import { NftClient } from '../src';

const getNfts = async () => {
  const client = new NftClient();
  const nfts = await client.getNftsForAddress('0x0ec841965c95866d38fa7bcd09047f4e0dfa0ed9');
  console.log('nfts', nfts);
};

getNfts();
