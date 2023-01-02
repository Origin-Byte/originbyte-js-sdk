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
    const res = await this.sendTx(tx, "WaitForEffectsCert");
    if (typeof res !== "object" || !("EffectsCert" in res)) {
      throw new Error(
        `Response does not contain EffectsCert: ${JSON.stringify(res)}`
      );
    }

    return res.EffectsCert.effects.effects;
  }
}
