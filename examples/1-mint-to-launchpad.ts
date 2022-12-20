import { NftClient } from "../src";
import {
  client,
  keypair,
  LAUNCHPAD_ID,
  PACKAGE_OBJECT_ID,
  signer,
} from "./common";

const mintToLaunchpad = async () => {
  const collections = await client.getCollectionsForAddress(
    `0x${keypair.getPublicKey().toSuiAddress()}`
  );

  const collectionsForWallet = collections.filter(
    (_) => _.packageObjectId === PACKAGE_OBJECT_ID
  );

  console.log("collectionForWallet", collectionsForWallet);
  if (collectionsForWallet.length) {
    const collection = collectionsForWallet[0];
    const mintNftTransaction = NftClient.buildMintNftTx({
      mintAuthority: collection.mintAuthorityId,
      moduleName: "suimarines",
      name: "My First NFT",
      description: "My First NFT",
      packageObjectId: collection.packageObjectId,
      url: "https://i.imgur.com/D5yhcTC.png",
      attributes: {
        Rarity: "Ultra-rare",
        Author: "OriginByte",
      },
      launchpadId: LAUNCHPAD_ID,
    });
    // console.log('signer', keypair.getPublicKey().toSuiAddress());
    const mintResult = await signer.executeMoveCall(mintNftTransaction);
    console.log("mintResult", mintResult);
  }
};

mintToLaunchpad();
