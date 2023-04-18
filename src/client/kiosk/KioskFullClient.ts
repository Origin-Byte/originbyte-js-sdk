import { Ed25519Keypair, JsonRpcProvider } from "@mysten/sui.js";
import { FullClient } from "../FullClient";
import { GlobalParams } from "../types";
import { KioskReadClient } from "./KioskReadClient";
import { createKioskTx } from "./txBuilder";
import { DEFAULT_PACKAGE_ID } from "../consts";

export class KioskFullClient extends KioskReadClient {
  constructor(
    public client: FullClient,
    // eslint-disable-next-line
    public opts: Partial<GlobalParams> = {}
  ) {
    super(client, opts);
  }

  public static fromKeypair(
    keypair: Ed25519Keypair,
    provider?: JsonRpcProvider,
    opts?: Partial<GlobalParams>
  ) {
    return new KioskFullClient(FullClient.fromKeypair(keypair, provider), opts);
  }

  static createKioskTx = createKioskTx;

  public createKiosk(params: GlobalParams) {
    return this.client.sendTxWaitForEffects(createKioskTx({
      ...this.opts,
      ...params,
      packageObjectId: DEFAULT_PACKAGE_ID
    }));
  }  
  

}