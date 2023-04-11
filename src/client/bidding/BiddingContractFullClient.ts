import { Ed25519Keypair, JsonRpcProvider } from "@mysten/sui.js";
import { CreateBidInput } from "./types";
import { GlobalParams } from "../types";
import { FullClient } from "../FullClient";
import { createBidTx } from "./txBuilder";

export class NftProtocolBiddingClient {

    constructor(
        private client: FullClient,
        private opts: Partial<GlobalParams> = {}
    ) {}

    public static fromKeypair(
    keypair: Ed25519Keypair,
    provider?: JsonRpcProvider,
    opts?: Partial<GlobalParams>
  ) {
    return new NftProtocolBiddingClient(
      FullClient.fromKeypair(keypair, provider),
      opts
    );
  }

  async createBid(p: CreateBidInput): Promise<any> {
    const effect = await this.client.sendTxWaitForEffects(
        createBidTx({
            ...this.opts,
            ...p
        })
    );
    console.debug(effect);
    return effect;
  }

  /* createBidWithCommission(p: CreateBidWithCommissionInput): Promise<Bid> {

  }

  sellNftFromKiosk(p: SellNftFromKiosk): Promise<void> {

  }

  sellNft(p: SellNft): Promise<void> {

  } */

}