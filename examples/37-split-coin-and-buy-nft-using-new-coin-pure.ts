import { TransactionBlock } from "@mysten/sui.js";
import { NftClient } from "../src";
import {
  LISTING_ID,
  PACKAGE_OBJECT_ID,
  signer,
  VENUE_ID,
  COLLECTION_ID_NAME,
} from "./common";

const SUI_TYPE = "0x2::sui::SUI";


const buyFromLaunchpad = async () => {
  const pubkeyAddress = await signer.getAddress()
  console.log("Address: ", pubkeyAddress);

  const coin = { id: "0x020db9452bbe3ca36f6869bfb93d42135f80818cbe31edf63b19178f0b711459" }

  const tx = new TransactionBlock();
  const coinCreationResult = tx.splitCoins(tx.gas, [tx.pure(100_000_000)]);
  const createdCoin = coinCreationResult[0]

  const args = {
    packageObjectId: PACKAGE_OBJECT_ID,
    nftType: COLLECTION_ID_NAME,
    coin: createdCoin,
    listing: LISTING_ID,
    venue: VENUE_ID,
    transaction: tx,
  }

  tx.moveCall({
    target: `${args.packageObjectId}::${"fixed_price"}::${"buy_nft"}`,
    typeArguments: [args.nftType, SUI_TYPE],
    arguments: [tx.object(args.listing), tx.object(args.venue), createdCoin],
  });

  const transferRes = tx.transferObjects([createdCoin], tx.pure(pubkeyAddress));
  tx.setGasBudget(250_000_000);

  const buyResult = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: { showEffects: true },
  });

  console.log("buyResult", JSON.stringify(buyResult));
};

buyFromLaunchpad();
