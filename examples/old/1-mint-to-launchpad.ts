import { NftClient } from "../../src";
import {
  client, COLLECTION_ID, MINT_CAP_ID, INVENTORY_ID, PACKAGE_OBJECT_ID, signer,
} from "../common";

const mintToLaunchpad = async () => {
  const collections = await client.getCollectionsById({ objectIds: [COLLECTION_ID] });

  const collectionsForWallet = collections.filter(
    (_) => _.packageObjectId === PACKAGE_OBJECT_ID
  );

  console.log("collectionForWallet", collections, collectionsForWallet);
  if (collectionsForWallet.length) {
    const collection = collectionsForWallet[0];
    const mintNftTransaction = NftClient.biuldMintNft({
      moduleName: "suimarines",
      name: "My First NFT",
      description: "My First NFT",
      packageObjectId: collection.packageObjectId,
      url: "https://i.imgur.com/D5yhcTC.png",
      attributes: {
        Rarity: "Ultra-rare",
        Author: "OriginByte",
      },
    inventoryId: INVENTORY_ID,
    mintCap: MINT_CAP_ID,
    });
    // console.log('signer', keypair.getPublicKey().toSuiAddress());
    const mintResult = await signer.executeMoveCall(mintNftTransaction);
    console.log("mintResult", JSON.stringify(mintResult));
  }
};

mintToLaunchpad();
