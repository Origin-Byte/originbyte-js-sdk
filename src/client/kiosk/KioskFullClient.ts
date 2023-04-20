import { Ed25519Keypair, JsonRpcProvider } from "@mysten/sui.js";
import { FullClient } from "../FullClient";
import { GlobalParams } from "../types";
import { KioskReadClient } from "./KioskReadClient";
import { 
  authExclusiveTransferTx, 
  authTransferTx, 
  createKioskTx, 
  delistNftAsOwnerTx, 
  depositTx, 
  disableDepositsOfCollectionTx, 
  enableAnyDepositTx, 
  newKioskTx, 
  removeAuthTransferAsOwnerTx, 
  removeAuthTransferTx, 
  restrictDepositsTx, 
  shareKioskTx, 
  transferDelegatedTx, 
  transferSignedTx, 
  withdrawNftTx 
} from "./txBuilder";
import { DEFAULT_PACKAGE_ID } from "../consts";
import { enableDepositsOfCollectionTx } from "../safe/txBuilder";

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

  static newKioskTx = newKioskTx;

  static shareKioskTx = shareKioskTx;

  static depositTx = depositTx;

  static authTransferTx = authTransferTx;

  static authExclusiveTransferTx = authExclusiveTransferTx;

  static transferDelegated = transferDelegatedTx;

  static transferSigned = transferSignedTx;

  static withdrawNftTx = withdrawNftTx;

  // static withdrawNftSignedTx = withdrawNftSignedTx; TODO

  // static transferBetweenOwned = transferBetweenOwned; TODO

  // static setTransferRequestAuth = setTransferRequestAuthTx; TODO

  // static getTransferRequestAuth = getTransferRequestAuthTx; TODO
  
  static delistNftAsOwnerTx = delistNftAsOwnerTx;

  static removeAuthTransferAsOwnerTx = removeAuthTransferAsOwnerTx;

  static removeAuthTransferTx = removeAuthTransferTx;

  static restrictDepositsTx = restrictDepositsTx;

  static enableAnyDepositTx = enableAnyDepositTx;

  static disableDepositOfCollectionTx = disableDepositsOfCollectionTx;

  static enableDepositsOfCollectionTx = enableDepositsOfCollectionTx;

  public createKiosk(params: GlobalParams) {
    return this.client.sendTxWaitForEffects(createKioskTx({
      ...this.opts,
      ...params,
      packageObjectId: DEFAULT_PACKAGE_ID
    }));
  }

  

}