import { TransactionBlock } from "@mysten/sui.js";
import { kioskClient, user } from "./common";

export const getKiosks = async (): Promise<void> => {
    const transaction = new TransactionBlock();
    transaction.setGasBudget(20000000);
    const kiosks = await kioskClient.getWalletKiosks(user);
    console.log("kiosk:", kiosks);
}
// eslint-disable-next-line no-global-assign

getKiosks();