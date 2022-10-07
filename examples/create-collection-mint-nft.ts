import {
  client, keypair, PACKAGE_OBJECT_ID, signer,
} from './common';

const createCollection = async () => {
  const createSharedCollectionTransaction = client.buildCreateSharedCollectionTransaction({
    name: 'Test',
    symbol: 'TEST',
    initialPrice: 100,
    maxSupply: 100,
    receiver: `0x${keypair.getPublicKey().toSuiAddress()}`,
    packageObjectId: PACKAGE_OBJECT_ID,
  });

  const transactionResult = await signer.executeMoveCall(createSharedCollectionTransaction);

  console.log('transactionResult', transactionResult);

  if (transactionResult.effects.status.status === 'success' && transactionResult.effects.created.length === 1) {
    const createdCollectionId = transactionResult.effects.created[0].reference.objectId;
    const mintNftTransaction = client.buildMintNftTransaction({
      collectionId: createdCollectionId,
      recepient: `0x${keypair.getPublicKey().toSuiAddress()}`,
      name: 'My First NFT',
      packageObjectId: PACKAGE_OBJECT_ID,
      uri: 'https://i.imgur.com/D5yhcTC.png',
      attributes: {
        Rarity: 'Ultra-rare',
        Author: 'OriginByte',
      },
      coin: '0x3898b6a63c4f14c2ae36980a425b8bccd0db77e5', // Coin address to pay for minting
    });
    const mintResult = await signer.executeMoveCall(mintNftTransaction);
    console.log('mintResult', mintResult);
  }
};

createCollection();
