import {
  Ed25519Keypair,
  ExecuteTransactionRequestType,
  MoveCallTransaction,
  Provider,
  RawSigner,
  SignerWithProvider,
  SuiExecuteTransactionResponse,
  TransactionEffects,
} from "@mysten/sui.js";
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

  public static fromKeypair(keypair: Ed25519Keypair, provider?: Provider) {
    return new FullClient(new RawSigner(keypair, provider));
  }

  async sendTx(
    tx: MoveCallTransaction,
    requestType?: ExecuteTransactionRequestType
  ): Promise<SuiExecuteTransactionResponse> {
    return this.signer.executeMoveCall(tx, requestType);
  }

  async sendTxWaitForEffects(
    tx: MoveCallTransaction
  ): Promise<TransactionEffects> {
    // there's a bug in the SDKs - the return type doesn't match the actual response
    const res = (await this.sendTx(tx, "WaitForEffectsCert")) as any;
    if (typeof res !== "object" || !("effects" in res)) {
      throw new Error(
        `Response does not contain effects: ${JSON.stringify(res)}`
      );
    }

    if (res.effects.effects.status.status === "failure") {
      throw new Error(
        `Transaction failed: ${res.effects.effects.status.error}`
      );
    }

    return res.effects.effects;
  }
}
