import { SUI_TYPE_ARG, TransactionBlock } from "@mysten/sui.js";
import { BiddingContractClient, KioskFullClient } from "../src";
import { kioskClient, signer, user } from "./common";

export const placeBid = async () => {
    const nftId = "0xb94dc94b2bb353dbc8230ab87f56c8db571c0431d66d762b9b316423002a8e4f";
    const transaction = new TransactionBlock();
    const kioskId = await kioskClient.getWalletKioskId(user);
    console.log("user", user);
    let kioskIdTransaction;
    const coin = transaction.splitCoins(transaction.gas, [transaction.pure(2_000_000_000)]);
    if(!kioskId) {
        // eslint-disable-next-line prefer-destructuring
        kioskIdTransaction = KioskFullClient.createKioskTx({transaction})[1];
    }

    BiddingContractClient.createBidTx({
        transaction,
        nft: nftId,
        buyersKiosk: "0xd060cc88e01a12d96810791b266e570616a001363ddffa70643bf1f32c1312b1",
        ft: SUI_TYPE_ARG,
        wallet: coin,
        price: 1
    });

    transaction.transferObjects([coin], transaction.pure(user));

    transaction.setGasBudget(2_000_000_000);

    await signer.signAndExecuteTransactionBlock({
        transactionBlock: transaction,
        options: { showEffects: true },
    });
    // console.log("bid tx", bidTx);
}

placeBid();