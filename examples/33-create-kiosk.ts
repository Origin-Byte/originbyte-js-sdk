import { TransactionBlock } from "@mysten/sui.js";
import { kioskClient } from "./common";

export const createKiosk = async (): Promise<void> => {
    const transaction = new TransactionBlock();
    transaction.setGasBudget(20000000);
    const kiosk = await kioskClient.createKiosk({transaction});
    console.log("kiosk:", kiosk);
}
// eslint-disable-next-line no-global-assign

createKiosk();