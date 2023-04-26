import {TransactionBlock } from "@mysten/sui.js";
import { KioskFullClient } from "../src";
import { signer } from "./common";

const depositNft = async () => {
    const bidId = process.env.BID_ID;

    if(!bidId) throw new Error("Use BID_ID env variable to provide a bid id");
    const nftId = "0x0626c9b4e068346891791d7e0c64aa83136fca111d0f8a229641dd4928af9ae8";
    const transaction = new TransactionBlock();
    transaction.setGasBudget(2_000_000_000);
    KioskFullClient.depositTx({
        transaction,
        kiosk: "0x7f164ff0d8df960ec64950ad12e04655284bf8bd5fe9ede3811f7c7a67364b8a",
        nftType: "0x48a968571e9665929f4ec54e0e102d7432dde1312fd704b231b450591b51fa90::clutchynfts::ClutchyNFT",
        nft: nftId
    });
    await signer.signAndExecuteTransactionBlock({
        transactionBlock: transaction,
        options: {
            showEffects: true
        } 
    });
}

depositNft();