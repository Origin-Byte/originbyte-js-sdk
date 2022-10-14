import { MoveCallTransaction } from '@mysten/sui.js';
import {
  client, COLLECTION_ID, keypair, PACKAGE_OBJECT_ID, signer,
} from './common';

// PLEASE DON't USE THIS CODE IN PRODUCTION
const createLaunchpad = async () => {
  console.log('Keypair public address', keypair.getPublicKey().toSuiAddress());

  const createLaunchpadTx: MoveCallTransaction = {
    packageObjectId: PACKAGE_OBJECT_ID,
    module: 'suimarines',
    function: 'create_launchpad',
    typeArguments: [],
    arguments: [
      COLLECTION_ID,
      `0x${keypair.getPublicKey().toSuiAddress()}`,
    ],
    gasBudget: 5000,
  };

  const transactionResult = await signer.executeMoveCall(createLaunchpadTx);

  console.log('transactionResult', transactionResult);

  // if (transactionResult.effects.status.status === 'success' && transactionResult.effects.created.length === 1) {
  //   const createdCollectionId = transactionResult.effects.created[0].reference.objectId;
  //   const createLaunchpadTx = client.buildCreateFixedPriceSlingshotTransaction({
  //     collectionId: createdCollectionId,
  //     packageObjectId: PACKAGE_OBJECT_ID,
  //     receiver: `0x${keypair.getPublicKey().toSuiAddress()}`,
  //     admin: `0x${keypair.getPublicKey().toSuiAddress()}`,
  //     price: 1,
  //   });

  //   const createLaunchpadTxResult = await signer.executeMoveCall(createLaunchpadTx);

  //   console.log('createLaunchpadTx', createLaunchpadTxResult.effects.status, createLaunchpadTxResult.effects.created);
  // }
};

createLaunchpad();
