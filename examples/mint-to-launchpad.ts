import {
  client, PACKAGE_OBJECT_ID, signer, keypair, AUTHORITY_ID, LAUNCHPAD_ID,
} from './common';

const mintToLaunchpad = async () => {
  const mintNftTransaction = client.buildMintNftTx({
    mintAuthority: AUTHORITY_ID,
    name: 'My First NFT',
    description: 'My First NFT',
    packageObjectId: PACKAGE_OBJECT_ID,
    url: 'https://i.imgur.com/D5yhcTC.png',
    attributes: {
      Rarity: 'Ultra-rare',
      Author: 'OriginByte',
    },
    launchpadId: LAUNCHPAD_ID,
    index: 1,
  });
  console.log('signer', keypair.getPublicKey().toSuiAddress());
  const mintResult = await signer.executeMoveCall(mintNftTransaction);
  console.log('mintResult', mintResult);
};

mintToLaunchpad();
