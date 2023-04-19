import { Ed25519Keypair, JsonRpcProvider } from "@mysten/sui.js";
import { CreateBidInput } from "./types";
import { GlobalParams } from "../types";
import { FullClient } from "../FullClient";
import { createBidTx, createBidWithCommissionTx, sellNft, sellNftFromKiosk } from "./txBuilder";

export class BiddingContractClient {
    // eslint-disable-next-line no-useless-constructor
    constructor(
        public client: FullClient,
        private opts: Partial<GlobalParams>
    // eslint-disable-next-line no-empty-function
    ) {}

    public static fromKeypair(
        keypair: Ed25519Keypair,
        provider?: JsonRpcProvider,
        opts?: Partial<GlobalParams>
    ) {
        return new BiddingContractClient(
            FullClient.fromKeypair(keypair, provider),
            opts
        );
    }

    static createBidTx = createBidTx;

    static createBidWithCommissionTx = createBidWithCommissionTx;

    static sellNftFromKiosk = sellNftFromKiosk;

    static sellNft = sellNft;

    async createBid(p: CreateBidInput): Promise<any> {
        const effect = await this.client.sendTxWaitForEffects(
            createBidTx({
                ...this.opts,
                ...p
            })
        );
        
        return effect;
    }

}