import {
  client, LAUNCHPAD_ID, PACKAGE_OBJECT_ID, signer,
} from './common';

const buyFromLaunchpad = async () => {
  const buyCertificateTransaction = client.buildBuyNftCertificate({
    collectionType: `${PACKAGE_OBJECT_ID}::suimarines::SUIMARINES`,
    packageObjectId: PACKAGE_OBJECT_ID,
    launchpadId: LAUNCHPAD_ID,
    wallet: '0x352ca4f1b92d544df8d0598a9d58fc76eec10b4b', // Coin address to pay for NFT
  });
  const buyResult = await signer.executeMoveCall(buyCertificateTransaction);
  console.log('buyResult', buyResult);
};

buyFromLaunchpad();
