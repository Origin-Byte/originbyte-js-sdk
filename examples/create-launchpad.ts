import {
  client, keypair, PACKAGE_OBJECT_ID, signer,
} from './common';

// PLEASE DON't USE THIS CODE IN PRODUCTION
const createLaunchpad = async () => {
  console.log('Keypair public address', keypair.getPublicKey().toSuiAddress());

  const createSharedCollectionTransaction = client.buildCreatePrivateCollectionTransaction({
    name: 'Test',
    symbol: 'TEST',
    initialPrice: 100,
    maxSupply: 100,
    receiver: `0x${keypair.getPublicKey().toSuiAddress()}`,
    recepient: `0x${keypair.getPublicKey().toSuiAddress()}`,
    packageObjectId: PACKAGE_OBJECT_ID,
  });

  const transactionResult = await signer.executeMoveCall(createSharedCollectionTransaction);

  console.log('transactionResult', transactionResult);

  if (transactionResult.effects.status.status === 'success' && transactionResult.effects.created.length === 1) {
    const createdCollectionId = transactionResult.effects.created[0].reference.objectId;
    const createLaunchpadTx = client.buildCreateFixedPriceSlingshotTransaction({
      collectionId: createdCollectionId,
      packageObjectId: PACKAGE_OBJECT_ID,
      receiver: `0x${keypair.getPublicKey().toSuiAddress()}`,
      admin: `0x${keypair.getPublicKey().toSuiAddress()}`,
      price: 1,
    });

    const createLaunchpadTxResult = await signer.executeMoveCall(createLaunchpadTx);

    console.log('createLaunchpadTx', createLaunchpadTxResult.effects.status, createLaunchpadTxResult.effects.created);
  }
};

createLaunchpad();
