import { Ed25519Keypair, JsonRpcProvider } from "@mysten/sui.js";
import { CreateBidInput } from "./types";
import { GlobalParams } from "../types";
import { FullClient } from "../FullClient";
import { closeBidTx, createBidTx, createBidWithCommissionTx, sellNftFromKioskTx, sellNftTx } from "./txBuilder";
import { BiddingContractReadClient } from "./BiddingContractReadClient";

export class BiddingContractClient extends BiddingContractReadClient {
    // eslint-disable-next-line no-useless-constructor
    constructor(
        public client: FullClient,
        public opts: Partial<GlobalParams>
    // eslint-disable-next-line no-empty-function
    ) {
        super(client, opts);
    }

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

    static sellNftFromKioskTx = sellNftFromKioskTx;

    static sellNftTx = sellNftTx;

    static closeBid = closeBidTx;

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