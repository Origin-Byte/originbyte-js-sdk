import {
  client, COLLECTION_ID, signer, LAUNCHPAD_ID,
} from './common';

const getNfts = async () => {
  const address = await signer.getAddress();
  console.log('Address:', `0x${address}`);
  const colection = await client.getCollectionsById({ objectIds: [COLLECTION_ID], resolveAuthorities: true });
  console.log('colection', COLLECTION_ID, colection, JSON.stringify(colection[0].mintAuthorityId));
  // // const nft = await client.getNftsById({ objectIds: ['0x6217aac47ffdf5959577fc781a1c720b9c21ac78'] });
  // const nfts = await client.getNftsForAddress(`0x${address}`);
  // console.log('nfts for wallet:', nfts);

  const launchpad = await client.getMarketsByParams({ objectIds: [LAUNCHPAD_ID] });
  console.log('launchpad', launchpad);
  // const certificates = await client.getNftCertificatesForAddress(`0x${keypair.getPublicKey().toSuiAddress()}`);
  // console.log('certificates', certificates);
};

getNfts();
