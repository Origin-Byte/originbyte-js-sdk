import { client, COLLECTION_ID, signer } from "./common";

const getNfts = async () => {
  const address = await signer.getAddress();
  const colection = await client.getCollectionsById({
    objectIds: [COLLECTION_ID],
  });
  console.log("colection", colection);
  // const nft = await client.getNftsById({ objectIds: ['0x6217aac47ffdf5959577fc781a1c720b9c21ac78'] });
  const nfts = await client.getNftsForAddress(`0x${address}`);
  console.log("nfts for wallet:", nfts);

  // const launchpad = await client.getMarketsByParams({ objectIds: [LAUNCHPAD_ID] });
  // console.log('launchpad', launchpad);
  // const certificates = await client.getNftCertificatesForAddress(`0x${keypair.getPublicKey().toSuiAddress()}`);
  // console.log('certificates', certificates);
};

getNfts();
