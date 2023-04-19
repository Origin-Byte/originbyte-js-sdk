import { SUI_TYPE_ARG, TransactionBlock } from "@mysten/sui.js";
import { BiddingContractClient } from "../src";
import { signer } from "./common";
import { DEFAULT_PACKAGE_ID } from "../src/client/consts";

const sellNft = async () => {
    const bidId = process.env.BID_ID;

    if(!bidId) throw new Error("Use BID_ID env variable to provide a bid id");
    const nftId = "0x0626c9b4e068346891791d7e0c64aa83136fca111d0f8a229641dd4928af9ae8";
    const transaction = new TransactionBlock();
    transaction.setGasBudget(2_000_000_000);
    console.log({
        transaction,
        bid: bidId,
        buyersKiosk: "0xe2e890b7073f14e9e85a40babf51f2170f0e827050d3cc66187385a3538e8bea",
        ft: SUI_TYPE_ARG,
        // eslint-disable-next-line max-len
        nftType: `${DEFAULT_PACKAGE_ID}::nft::Nft<0x48a968571e9665929f4ec54e0e102d7432dde1312fd704b231b450591b51fa90::clutchynfts::ClutchyNFT>`,
        nft: nftId
    });
    BiddingContractClient.sellNftTx({
        transaction,
        bid: bidId,
        buyersKiosk: "0xe2e890b7073f14e9e85a40babf51f2170f0e827050d3cc66187385a3538e8bea",
        ft: SUI_TYPE_ARG,
        // eslint-disable-next-line max-len
        nftType: `${DEFAULT_PACKAGE_ID}::nft::Nft<0x48a968571e9665929f4ec54e0e102d7432dde1312fd704b231b450591b51fa90::clutchynfts::ClutchyNFT>`,
        nft: nftId
    });
    await signer.signAndExecuteTransactionBlock({
        transactionBlock: transaction,
        options: {
            showEffects: true
        } 
    });
}

sellNft();