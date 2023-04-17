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

  const coin = { id: "0x5a3577670a95e163ae24888de8a8c4a28d167b81a3571553618a4e7fb7cbea82" }

  const tx = new TransactionBlock();
  const coinCreationResult = tx.splitCoins(tx.object(coin.id), [tx.pure(1_000_000)]);
  const createdCoin = coinCreationResult[0]
  const transferRes = tx.transferObjects([createdCoin], tx.pure(pubkeyAddress));

  const args = {
    packageObjectId: PACKAGE_OBJECT_ID,
    nftType: COLLECTION_ID_NAME,
    coin: coinCreationResult,
    listing: LISTING_ID,
    venue: VENUE_ID,
    transaction: tx,
  }

  tx.moveCall({
    target: `${args.packageObjectId}::${"fixed_price"}::${"buy_nft"}`,
    typeArguments: [args.nftType, SUI_TYPE],
    // arguments: [tx.object(args.listing), tx.object(args.venue), tx.object(coin.id)], // this one works perfectly
    arguments: [tx.object(args.listing), tx.object(args.venue), createdCoin],

  });

  tx.setGasBudget(200_000_000);

  const buyResult = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: { showEffects: true },
  });

  console.log("buyResult", JSON.stringify(buyResult));
};

buyFromLaunchpad();
