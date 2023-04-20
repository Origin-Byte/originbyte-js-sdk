import { TransactionBlock } from "@mysten/sui.js";
import { signer, user } from "./common";
import { KioskFullClient } from "../src";

export const createKiosk = async (): Promise<void> => {
    const transaction = new TransactionBlock();
    const kiosk = KioskFullClient.newKioskTx({transaction})[1];

    const share = KioskFullClient.shareKioskTx({
        transaction,
        kiosk
    })

    transaction.setGasBudget(2_000_000_000);

    await signer.signAndExecuteTransactionBlock({
        transactionBlock: transaction,
        options: { showEffects: true },
    });
    console.log("user", user);
    console.log("kiosk:", kiosk, share);
}
// eslint-disable-next-line no-global-assign

createKiosk();