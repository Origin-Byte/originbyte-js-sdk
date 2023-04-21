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

  const WHITELIST_CERTIFICATE_OBJECT_ID =
    "0xea72ced7d1bfb223395a2818ccc47b72eb838ae2ecc26bddc1a6d04d4cfef2fa";

  let tx = new TransactionBlock();
  const coinCreationResult = tx.splitCoins(tx.gas, [tx.pure(250_000_000)]);
  const [kioskTxBlock, kioskTxResult] = KioskFullClient.newKioskTx({
    transaction: tx,
  });

  const module: "limited_fixed_price" = "limited_fixed_price";

  const args = {
    module,
    packageObjectId: PACKAGE_OBJECT_ID,
    nftType: COLLECTION_ID_NAME,
    coin: coinCreationResult,
    buyersKiosk: kioskTxResult,
    listing: LISTING_ID,
    venue: VENUE_ID,
    whitelistCertificate: WHITELIST_CERTIFICATE_OBJECT_ID,
    transaction: tx,
  };

  console.log("[buyFromLaunchpad] args: ", args);

  [tx] = NftClient.buildBuyWhitelistedNftIntoKiosk(args);
  tx = kioskTxBlock;
  KioskFullClient.shareKioskTx({
    transaction: tx,
    kiosk: kioskTxResult,
  });

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
