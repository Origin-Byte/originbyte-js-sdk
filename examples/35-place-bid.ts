import { SUI_TYPE_ARG, TransactionBlock } from "@mysten/sui.js";
import { BiddingContractClient, KioskFullClient } from "../src";
import { signer, user } from "./common";

export const placeBid = async () => {
    const nftId = "0x0626c9b4e068346891791d7e0c64aa83136fca111d0f8a229641dd4928af9ae8";
    const transaction = new TransactionBlock();
    const kioskId: any = undefined;
    console.log("user", user);
    let kioskIdTransaction;
    const coin = transaction.splitCoins(transaction.gas, [transaction.pure(2_000_000_000)]);
    if(!kioskId) {
        // eslint-disable-next-line prefer-destructuring
        kioskIdTransaction = KioskFullClient.newKioskTx({transaction})[1];
        console.log(kioskIdTransaction);
    }

    BiddingContractClient.createBidTx({
        transaction,
        nft: nftId,
        buyersKiosk: kioskIdTransaction || kioskId,
        ft: SUI_TYPE_ARG,
        wallet: coin,
        price: 1
    });

    transaction.transferObjects([coin], transaction.pure(user));

    if(kioskIdTransaction) {
        KioskFullClient.shareKioskTx({
            transaction,
            kiosk: kioskIdTransaction
        });
    }

    transaction.setGasBudget(2_000_000_000);

    await signer.signAndExecuteTransactionBlock({
        transactionBlock: transaction,
        options: { showEffects: true },
    });
    // console.log("bid tx", bidTx);
}

placeBid();