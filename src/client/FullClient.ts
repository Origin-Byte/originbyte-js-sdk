import {
  Ed25519Keypair,
  TransactionBlock,
  JsonRpcProvider,
  RawSigner,
  SignerWithProvider,
  TransactionEffects,
} from "@mysten/sui.js";
import { TransactionResult } from "./orderbook/txBuilder";
import { ReadClient } from "./ReadClient";

export class FullClient extends ReadClient {
  // eslint-disable-next-line
  constructor(public signer: SignerWithProvider) {
    super(signer.provider);
    // In case the provider is not connected, we default it in the constructor
    // of ReadClient.
    // Hence reconnecting here.
    signer.connect(this.provider);
  }

  public static fromKeypair(
    keypair: Ed25519Keypair,
    provider?: JsonRpcProvider
  ) {
    return new FullClient(new RawSigner(keypair, provider));
  }

  async sendTx(transactionBlock: TransactionBlock) {
    return this.signer.signAndExecuteTransactionBlock({
      transactionBlock,
      options: { showEffects: true, showObjectChanges: true },
    });
  }

  async sendTxWaitForEffects(
    tx: [TransactionBlock, TransactionResult]
  ): Promise<TransactionEffects> {
    const [transactionBlock] = tx;
    // there's a bug in the SDKs - the return type doesn't match the actual response
    const res = await this.sendTx(transactionBlock);
    if (typeof res !== "object" || !("effects" in res)) {
      throw new Error(
        `Response does not contain effects: ${JSON.stringify(res)}`
      );
    }

    if (res.effects.status.status === "failure") {
      throw new Error(`Transaction failed: ${res.effects.status.error}`);
    }

    return res.effects;
  }
}
