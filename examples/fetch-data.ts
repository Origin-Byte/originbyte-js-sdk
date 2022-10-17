import {
  client, COLLECTION_ID, LAUNCHPAD_ID, keypair,
} from './common';

const getNfts = async () => {
  const colection = await client.getCollectionsById({ objectIds: [COLLECTION_ID] });
  console.log('colection', colection);
  const nft = await client.getNftsById({ objectIds: ['0x6217aac47ffdf5959577fc781a1c720b9c21ac78'] });
  console.log('nft', nft);

  // const launchpad = await client.getMarketsByParams({ objectIds: [LAUNCHPAD_ID] });
  // console.log('launchpad', launchpad);
  // const certificates = await client.getNftCertificatesForAddress(`0x${keypair.getPublicKey().toSuiAddress()}`);
  // console.log('certificates', certificates);
};

getNfts();
