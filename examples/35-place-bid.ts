import { SUI_TYPE_ARG, TransactionBlock } from "@mysten/sui.js";
import { BiddingContractClient, KioskFullClient } from "../src";
import { signer, user } from "./common";

export const placeBid = async () => {
    const nftId = "0x0626c9b4e068346891791d7e0c64aa83136fca111d0f8a229641dd4928af9ae8";
    const transaction = new TransactionBlock();
    const kioskId: any = undefined // ((await kioskClient.getWalletKiosk(user))?.id as any).id;
    let kioskIdTransaction;
    let kiosk;
    const coin = transaction.splitCoins(transaction.gas, [transaction.pure(2_000_000_000)]);
    if(!kioskId) {
        // eslint-disable-next-line prefer-destructuring
        kiosk = KioskFullClient.newKioskTx({transaction})[1];
        // eslint-disable-next-line prefer-destructuring
        kioskIdTransaction = KioskFullClient.getObjectIdTx({transaction, kiosk})[1];
    }

    BiddingContractClient.createBidWithCommissionTx({
        transaction,
        nft: nftId,
        buyersKiosk: kioskIdTransaction || kioskId,
        ft: SUI_TYPE_ARG,
        wallet: coin,
        beneficiary: "0xd4066588fee19db7524ec85bc9e1b873b5ccc1cea3e6e2c9c8b12ed76c593cb9",
        commission: 1,
        price: 1
    });

    if(kioskIdTransaction) {
        KioskFullClient.shareKioskTx({
            transaction,
            kiosk
        });
    }

    transaction.transferObjects([coin], transaction.pure(user));

    transaction.setGasBudget(2_000_000_000);

    await signer.signAndExecuteTransactionBlock({
        transactionBlock: transaction,
        options: { showEffects: true },
    });
    // console.log("bid tx", bidTx);
}

placeBid();