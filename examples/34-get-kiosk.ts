import { TransactionBlock } from "@mysten/sui.js";
import { kioskClient, user } from "./common";

export const getKiosks = async (): Promise<void> => {
    const transaction = new TransactionBlock();
    transaction.setGasBudget(20000000);
    const kiosk = await kioskClient.getWalletKiosk(user);
    console.log("kiosk:", kiosk);
}
// eslint-disable-next-line no-global-assign

getKiosks();