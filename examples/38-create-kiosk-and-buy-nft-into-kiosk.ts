import { TransactionBlock } from "@mysten/sui.js";
import { KioskFullClient, NftClient } from "../src";
import {
  LISTING_ID,
  NFT_TYPE,
  PACKAGE_OBJECT_ID,
  signer,
  VENUE_ID,
  COLLECTION_ID_NAME,
  kioskClient,
} from "./common";

const buyFromLaunchpad = async () => {
  const pubkeyAddress = await signer.getAddress();
  console.log("signer address: ", pubkeyAddress);

  let tx = new TransactionBlock();
  const coinCreationResult = tx.splitCoins(tx.gas, [tx.pure(250_000_000)]);
  const [kioskTxBlock, kioskTxResult] = KioskFullClient.newKioskTx({
    transaction: tx,
  });
  tx = kioskTxBlock;

  const module: "limited_fixed_price" = "limited_fixed_price";

  const args = {
    module,
    packageObjectId: PACKAGE_OBJECT_ID,
    nftType: COLLECTION_ID_NAME,
    coin: coinCreationResult,
    buyersKiosk: kioskTxResult,
    // buyersKiosk: "0xec117b5a1a33832fc91c9d81976775b16e5f27621a60185920a3d0ebcaacc62b",
    listing: LISTING_ID,
    venue: VENUE_ID,
    transaction: tx,
  };

  console.log("[buyFromLaunchpad] args: ", args);

  [tx] = NftClient.buildBuyNftIntoKiosk(args);
  const [shareKioskTxBlock, shareKioskTxResult] = KioskFullClient.shareKioskTx({
    transaction: tx,
    kiosk: kioskTxResult,
  });
  tx = shareKioskTxBlock;

  tx.transferObjects([coinCreationResult], tx.pure(pubkeyAddress));
  tx.setGasBudget(1_200_000_000);

  console.log("tx: ", tx.blockData);

  const buyResult = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: { showEffects: true },
  });

  console.log("buyResult", JSON.stringify(buyResult));
};

buyFromLaunchpad();
