import {
  client,
} from './common';

const fetchNft = async () => {
  const nfts = await client.getNftsById({ objectIds: ['0xa57ba417f0227407d6eb247d670f129bf1aec6b8'] });
  console.log('nfts', JSON.stringify(nfts, null, 2));
};

fetchNft();
