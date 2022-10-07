import { client } from './common';

const getNfts = async () => {
  const nfts = await client.getNftsForAddress('0xd2302a4840cf44bef12392e5225848511190c018');
  console.log('nfts', nfts);
};

getNfts();
