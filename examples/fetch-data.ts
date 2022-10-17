import {
  client, COLLECTION_ID, LAUNCHPAD_ID, keypair,
} from './common';

const getNfts = async () => {
  const colection = await client.getCollectionsForAddress('0x2d2e3b39db8678a20b9458804eefd8b2db7fb03f');
  console.log('colection', colection);
  const nft = await client.getNftsById({ objectIds: ['0x6217aac47ffdf5959577fc781a1c720b9c21ac78'] });
  console.log('nft', nft);

  const launchpad = await client.getMarketsByParams({ objectIds: [LAUNCHPAD_ID] });
  console.log('launchpad', launchpad);
  const certificates = await client.getNftCertificatesForAddress(`0x${keypair.getPublicKey().toSuiAddress()}`);
  console.log('certificates', certificates);
};

getNfts();
