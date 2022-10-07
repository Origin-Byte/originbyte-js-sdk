import { client, PACKAGE_OBJECT_ID, signer } from './common';

const mintToLaunchpad = async () => {
  const LAUNCHPAD_ID = '0x5f3a8bd1fcaa564db5165cbbb9894a94d4bacc70';
  const COLLECTION_ID = '0xf4a16dfd53ebad44fa82e3c14541dd39a643705d';

  const mintNftTransaction = client.buildMintToLaunchpadTransaction({
    collectionId: COLLECTION_ID,
    name: 'My First NFT',
    packageObjectId: PACKAGE_OBJECT_ID,
    url: 'https://i.imgur.com/D5yhcTC.png',
    attributes: {
      Rarity: 'Ultra-rare',
      Author: 'OriginByte',
    },
    isMutable: true,
    launchpadId: LAUNCHPAD_ID,
    coin: '0xfaaba23e89ec7c264f410fd176192cffbf3cef37', // Coin address to pay for minting
  });
  const mintResult = await signer.executeMoveCall(mintNftTransaction);
  console.log('mintResult', mintResult);
};

mintToLaunchpad();
