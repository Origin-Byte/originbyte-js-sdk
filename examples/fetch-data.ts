import { NftClient } from '@originbyte/js-sdk';

const getNfts = async () => {
  const client = new NftClient();
  const nfts = await client.getNftsForAddress('0xd2302a4840cf44bef12392e5225848511190c018');
  console.log('nfts', nfts);
};

getNfts();
