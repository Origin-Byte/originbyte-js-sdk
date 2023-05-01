import { SUI_TYPE_ARG, TransactionBlock } from "@mysten/sui.js";
import {
  ORDERBOOK_ID,
  COLLECTION_ID_NAME,
  signer,
  getKiosks,
  ORDERBOOK_PACKAGE_ID,
} from "./common";
import { OrderbookFullClient } from "../src";

export const placeBidWithCommission = async () => {
  const pubkeyAddress = await signer.getAddress();
  console.log("Address: ", pubkeyAddress);

  const kiosks = await getKiosks();

  if (kiosks.length === 0) {
    console.debug("No kiosks found");
    return;
  }

  let tx = new TransactionBlock();
  const coinCreationResult = tx.splitCoins(tx.gas, [tx.pure(100_000_000)]);

  [tx] = OrderbookFullClient.createBidWithCommissionTx({
    packageObjectId: ORDERBOOK_PACKAGE_ID,
    buyersKiosk: kiosks[0].id.id,
    collection: COLLECTION_ID_NAME,
    ft: SUI_TYPE_ARG,
    orderbook: ORDERBOOK_ID,
    price: 35_000_000,
    wallet: coinCreationResult,
    beneficiary:
      "0x610b690cdf5104a8cd1e49a2ae0cf2e9f621b1f41c0648adbeb95da013f6ca2c",
    commission: 10_000_000,
    transaction: tx,
  });

  const transferRes = tx.transferObjects(
    [coinCreationResult],
    tx.pure(pubkeyAddress)
  );
  tx.setGasBudget(100_000_000);

  // console.debug("tx: ", tx.blockData)

  const result = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: { showEffects: true },
  });

  console.log("result", JSON.stringify(result));
};

placeBidWithCommission();
