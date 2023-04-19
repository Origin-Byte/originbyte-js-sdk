import { TransactionBlock } from "@mysten/sui.js";
import { kioskClient, user } from "./common";

export const createKiosk = async (): Promise<void> => {
    const transaction = new TransactionBlock();
    transaction.setGasBudget(2_000_000_000);
    const kiosk = await kioskClient.createKiosk({transaction});
    console.log("user", user);
    console.log("kiosk:", kiosk);
}
// eslint-disable-next-line no-global-assign

createKiosk();