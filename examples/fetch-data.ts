import { client, COLLECTION_ID } from './common';

const getNfts = async () => {
  const colection = await client.getCollectionsForAddress('0x2d2e3b39db8678a20b9458804eefd8b2db7fb03f');
  console.log('colection', colection);
};

getNfts();
