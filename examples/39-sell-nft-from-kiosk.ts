import { SUI_TYPE_ARG, TransactionBlock } from "@mysten/sui.js";
import { BiddingContractClient, TransferRequestFullClient } from "../src";
import { signer } from "./common";

const sellNft = async () => {
    const nftId = "0xca7641cd043534e699656d05975c6ad7a3d560152861273ace98724459399a80";
    const transaction = new TransactionBlock();
    transaction.setGasBudget(2_000_000_000);
    const transferRequest = BiddingContractClient.sellNftFromKioskTx({
        packageObjectId: "0xda5ce01d0e365f2aac8df7d85d1cdfe271fd75db338daf248132991d74c2f1c8",
        transaction,
        sellersKiosk: "0x48d20b5ce62081edb749c59320a7faaa80207b8e378d68aeaa2bea29643de218",
        bid: "0x207596fa8dd865577ae54aa85845bc48c8f8d224a4d6eea0c7a7b6ed57e8dc6b",
        buyersKiosk: "0x27c7d4f79ddc07f256f937df5ea99ee0a59c4f95fa91ab5e9886f8e11d3e83e0",
        ft: SUI_TYPE_ARG,
        // eslint-disable-next-line max-len
        nftType: "0x48a968571e9665929f4ec54e0e102d7432dde1312fd704b231b450591b51fa90::clutchynfts::ClutchyNFT",
        nft: nftId
    })[1];

    TransferRequestFullClient.confirmTx({
        transaction,
        transferRequest,
        allowListId: "0x93585b915cc6b8dd38904d0fd8398f871ef1aa34001f938aa0a7bb1d1321ab0a",
        policyId: "",
        bpsRoyaltyStrategy: "0x750c4e897f39f10027d7aec8f28442ead1132d6b249d97cd8419dcfaf791da20",
        ft: SUI_TYPE_ARG,
        transferRequestType: "0x48a968571e9665929f4ec54e0e102d7432dde1312fd704b231b450591b51fa90::clutchynfts::ClutchyNFT"
    });

    await signer.signAndExecuteTransactionBlock({
        transactionBlock: transaction,
        options: {
            showEffects: true
        } 
    });
}

sellNft();