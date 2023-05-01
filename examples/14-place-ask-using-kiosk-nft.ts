import { SUI_TYPE_ARG, TransactionBlock } from "@mysten/sui.js";
import {
  ORDERBOOK_ID,
  COLLECTION_ID_NAME,
  signer,
  client,
  getKiosks,
  ORDERBOOK_PACKAGE_ID,
} from "./common";
import { OrderbookFullClient } from "../src";

export const placeAsk = async () => {
  const pubkeyAddress = await signer.getAddress();
  console.log("Address: ", pubkeyAddress);

  const kiosks = await getKiosks()

  if (kiosks.length === 0) {
    console.error("No kiosks found");
    return;
  }

  const kiosk = kiosks[0];
  const kioskFields = await client.getDynamicFields(kiosk.id.id);

  console.log("kioskFields: ", kioskFields);

  const nftsFromKiosk = kioskFields
    .filter((el) => {
      const displayData = el?.data?.display?.data;
      return (
        displayData != null &&
        typeof displayData === "object" &&
        "image_url" in displayData
      );
    })
    .filter((el) => {
      const displayData = el?.data?.display?.data;
      return (
        displayData != null &&
        typeof displayData === "object" &&
        "image_url" in displayData &&
        el?.data?.display != null &&
        typeof el.data.display === "object" &&
        el.data.display.data != null &&
        typeof el.data.display.data === "object"
      );
    })
    .filter((el) => el?.data?.type?.includes(COLLECTION_ID_NAME))
    .map((el) => el?.data?.objectId);

  const nft = nftsFromKiosk[0];

  if (!nft) {
    console.error("No nft found");
    return;
  }

  console.log("nft: ", nft);

  let tx = new TransactionBlock();

  [tx] = OrderbookFullClient.createAskTx({
    packageObjectId: ORDERBOOK_PACKAGE_ID,
    sellersKiosk: kiosks[0].id.id,
    nft,
    collection: COLLECTION_ID_NAME,
    ft: SUI_TYPE_ARG,
    orderbook: ORDERBOOK_ID,
    price: 175_000_000,
  });

  tx.setGasBudget(100_000_000);
  const result = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: { showEffects: true },
  });

  console.log("result: ", result);
};

placeAsk();
