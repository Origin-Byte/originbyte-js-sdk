import { Ed25519Keypair, JsonRpcProvider, RawSigner } from '@mysten/sui.js';
import { NftClient } from '@originbyte/js-sdk';
import * as bip39 from 'bip39-light';

// PLEASE DON't USE THIS CODE IN PRODUCTION
const mnemonic = 'finger wonder priority theme vibrant indoor cause man rib urban wine betray';

const PACKAGE_OBJECT_ID = '0x5927d212da88a4124681751ee9fb803781e72724'; // Change to your deployed contract
const createCollection = async () => {
  const seed = bip39.mnemonicToSeed(mnemonic);

  const keypair = Ed25519Keypair.fromSeed(new Uint8Array(seed.toJSON().data.slice(0, 32)));

  const provider = new JsonRpcProvider('https://gateway.devnet.sui.io');
  const signer = new RawSigner(keypair, provider);
  const client = new NftClient(provider);
  console.log('Keypair public address', keypair.getPublicKey().toSuiAddress());

  const createSharedCollectionTransaction = client.buildSharedCreateCollectionTransaction({
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
