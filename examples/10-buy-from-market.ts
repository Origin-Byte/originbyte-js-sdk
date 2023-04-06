import { NftClient } from "../src";
import {
  LISTING_ID,
  NFT_TYPE,
  PACKAGE_OBJECT_ID,
  signer,
  VENUE_ID,
} from "./common";

const buyFromLaunchpad = async () => {
  console.log("Address", await signer.getAddress());
  const [buyCertificateTransaction] = NftClient.buildBuyNft({
    packageObjectId: PACKAGE_OBJECT_ID,
    nftType: NFT_TYPE,
    coin: "0x12ddc56e41944a83893ef99df474b2f0d249e05f9ff9593f1254624d5794d9a8",
    listing: LISTING_ID,
    venue: VENUE_ID,
  });

  buyCertificateTransaction.setGasBudget(20000);
  const buyResult = await signer.signAndExecuteTransactionBlock({
    transactionBlock: buyCertificateTransaction,
    options: { showEffects: true },
  });

  console.log("buyResult", JSON.stringify(buyResult));
};

buyFromLaunchpad();
