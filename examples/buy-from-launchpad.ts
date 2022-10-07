import { client, PACKAGE_OBJECT_ID, signer } from './common';

const mintToLaunchpad = async () => {
  const LAUNCHPAD_ID = '0x5f3a8bd1fcaa564db5165cbbb9894a94d4bacc70';

  const buyCertificateTransaction = client.buildBuyNftCertiicateTransaction({
    packageObjectId: PACKAGE_OBJECT_ID,
    launchpadId: LAUNCHPAD_ID,
    coin: '0x7425b9b847cf4ce7ae949fac310300fd5ebdd4f8', // Coin address to pay for NFT
  });
  const buyResult = await signer.executeMoveCall(buyCertificateTransaction);
  console.log('mintResult', buyResult.effects.status, buyResult.effects.created);
};

mintToLaunchpad();
