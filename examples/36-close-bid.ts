import { SUI_TYPE_ARG, TransactionBlock } from "@mysten/sui.js";
import { BiddingContractClient } from "../src";
import { signer } from "./common";

const closeBid = async () => {
    const bidId = process.env.BID_ID;
    const kioskId = process.env.KIOSK_ID;
    if(!bidId) throw new Error("Use BID_ID env variable to provide a bid id");
    if(!kioskId) throw new Error("Use KioskId env variable to provide a bid id");
    const transaction = new TransactionBlock();
    transaction.setGasBudget(2_000_000_000);
    BiddingContractClient.closeBid({bid: bidId, ft: SUI_TYPE_ARG, kioskId, transaction});
    await signer.signAndExecuteTransactionBlock({
        transactionBlock: transaction,
        options: {
            showEffects: true
        } 
    });
}

closeBid();