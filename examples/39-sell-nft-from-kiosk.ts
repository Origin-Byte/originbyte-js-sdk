import { SUI_TYPE_ARG, TransactionBlock } from "@mysten/sui.js";
import { BiddingContractClient, TransferRequestFullClient } from "../src";
import { signer } from "./common";

const sellNft = async () => {
    const nftId = "0x2348d7d2ff8640ccf0652e3816a22805c90c0274ac0163e964d1f7dd10fdab42";
    const transaction = new TransactionBlock();
    transaction.setGasBudget(2_000_000_000);
    const transferRequest = BiddingContractClient.sellNftFromKioskTx({
        packageObjectId: "0xda5ce01d0e365f2aac8df7d85d1cdfe271fd75db338daf248132991d74c2f1c8",
        transaction,
        sellersKiosk: "0xb2edabd927abaa3ec96e45fd17ff308f4a31dd93975a5bee3d3a439681f242e6",
        bid: "0xabb3fc781b80169f1e2dc9af7e755139dc4ec2b3fd1c2edefec0ca6c6f19b858",
        buyersKiosk: "0x7f023e73b136f3ddf59d8fb5099b4ab0bd79a935f733ee2ee8471fe388230dc6",
        ft: SUI_TYPE_ARG,
        // eslint-disable-next-line max-len
        nftType: "0x12a6b2cdc56c0506bf1d0a61822f6ac7e49150056272c15b5fa0f898a94caeae::clutchynfts::ClutchyNft",
        nft: nftId
    })[1];

    TransferRequestFullClient.confirmTx({
        transaction,
        transferRequest,
        allowListId: "0x93585b915cc6b8dd38904d0fd8398f871ef1aa34001f938aa0a7bb1d1321ab0a",
        policyId: "0x95d893d25315d6cf5fec3be2c296d87d4d7e1b274a97aa41690e30c4f204b12b",
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