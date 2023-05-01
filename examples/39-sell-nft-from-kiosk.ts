import { SUI_TYPE_ARG, TransactionBlock } from "@mysten/sui.js";
import { BiddingContractClient, TransferRequestFullClient } from "../src";
import { signer } from "./common";

const sellNft = async () => {
    const nftId = "0x2ea383137c90c07fe46ba53b85010d5bf4c79c403590a2c59706db6a724d42fc";
    const transaction = new TransactionBlock();
    transaction.setGasBudget(2_000_000_000);
    const transferRequest = BiddingContractClient.sellNftFromKioskTx({
        packageObjectId: "0xd34b56feab8ec4e31e32b30564e1d6b11eb32f2985c3fbb85b5be715df006536",
        transaction,
        sellersKiosk: "0xabd99fcc4295899342fde765e758ad724ca1baa90bec7dbba6af777f9483f94f",
        bid: "0x31045b89422ac100cb5c3ca4495395c34291a9730a31693584f2582f9b3270ba",
        buyersKiosk: "0x4c1992360d60a8b1628aa734bdc844d52d999f00f7bc75a705518780fa11be36",
        ft: SUI_TYPE_ARG,
        // eslint-disable-next-line max-len
        nftType: "0xc64714be5cb0c9c9ab6c349964b18eb11b9739155dd1dfd9af0abe2d71eebb86::clutchynfts::ClutchyNft",
        nft: nftId
    })[1];

    TransferRequestFullClient.confirmTx({
        transaction,
        requestContractId: "0x33324b87a09f5b2928d8d62a00eb66f93baa8d7545330c8c8ca15da2c80cbc82",
        nftProtocolContractId: "0xd624568412019443dbea9c4e97a6c474cececa7e9daef307457cb34dd04eee0d",
        transferRequest,
        allowListId: "0x641dcb7bf80a537e46e29e27c637f639ba8f644d5daf396e2b212b9bbe6c0383",
        policyId: "0x82fc231d6aa2488a4420099841476e658ef1ce39aae557efca5fddc7da156929",
        bpsRoyaltyStrategy: "0x721b29839f5c93329afc040316128272679363774440f3f8d596079d62446e24",
        ft: SUI_TYPE_ARG,
        transferRequestType: "0xc64714be5cb0c9c9ab6c349964b18eb11b9739155dd1dfd9af0abe2d71eebb86::clutchynfts::ClutchyNft"
    });

    await signer.signAndExecuteTransactionBlock({
        transactionBlock: transaction,
        options: {
            showEffects: true
        } 
    });
}

sellNft();