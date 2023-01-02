import { Ed25519Keypair, ObjectId, Provider } from "@mysten/sui.js";
import { FullClient } from "../FullClient";
import { SafeReadClient } from "./SafeReadClient";
import { GlobalParams } from "../types";
import {
  burnTransferCapTx,
  createExclusiveTransferCapForSenderTx,
  createSafeForSenderTx,
  createTransferCapForSenderTx,
  delistNftTx,
  depositGenericNftPrivilegedTx,
  depositGenericNftTx,
  depositNftPrivilegedTx,
  depositNftTx,
  disableDepositsOfCollectionTx,
  enableAnyDepositTx,
  enableDepositsOfCollectionTx,
  restrictDepositsTx,
} from "./txBuilder";

export class SafeFullClient extends SafeReadClient {
  constructor(
    public client: FullClient,
    // eslint-disable-next-line
    public opts: Partial<GlobalParams> = {}
  ) {
    super(client);
  }

  public static fromKeypair(keypair: Ed25519Keypair, provider?: Provider) {
    return new SafeFullClient(FullClient.fromKeypair(keypair, provider));
  }

  static burnTransferCapTx = burnTransferCapTx;

  static createExclusiveTransferCapForSenderTx =
    createExclusiveTransferCapForSenderTx;

  static createSafeForSenderTx = createSafeForSenderTx;

  static createTransferCapForSenderTx = createTransferCapForSenderTx;

  static delistNftTx = delistNftTx;

  static depositGenericNftPrivilegedTx = depositGenericNftPrivilegedTx;

  static depositGenericNftTx = depositGenericNftTx;

  static depositNftPrivilegedTx = depositNftPrivilegedTx;

  static depositNftTx = depositNftTx;

  static disableDepositsOfCollectionTx = disableDepositsOfCollectionTx;

  static enableAnyDepositTx = enableAnyDepositTx;

  static enableDepositsOfCollectionTx = enableDepositsOfCollectionTx;

  static restrictDepositsTx = restrictDepositsTx;

  public burnTransferCap(p: { transferCap: ObjectId; safe: ObjectId }) {
    return this.client.sendTxWaitForEffects(
      burnTransferCapTx({
        ...this.opts,
        ...p,
      })
    );
  }

  public createExclusiveTransferCapForSender(p: {
    safe: ObjectId;
    ownerCap: ObjectId;
    nft: ObjectId;
  }) {
    return this.client.sendTxWaitForEffects(
      createExclusiveTransferCapForSenderTx({
        ...this.opts,
        ...p,
      })
    );
  }

  public createSafeForSender() {
    return this.client.sendTxWaitForEffects(createSafeForSenderTx(this.opts));
  }

  public createTransferCapForSender(p: {
    safe: ObjectId;
    ownerCap: ObjectId;
    nft: ObjectId;
  }) {
    return this.client.sendTxWaitForEffects(
      createTransferCapForSenderTx({
        ...this.opts,
        ...p,
      })
    );
  }

  public async delistNft(p: {
    safe: ObjectId;
    nft: ObjectId;
    ownerCap: ObjectId;
  }) {
    return this.client.sendTxWaitForEffects(
      delistNftTx({
        ...this.opts,
        ...p,
      })
    );
  }

  public async depositGenericNftPrivileged(p: {
    safe: ObjectId;
    nft: ObjectId;
    ownerCap: ObjectId;
    collection: string;
  }) {
    return this.client.sendTxWaitForEffects(
      depositGenericNftPrivilegedTx({
        ...this.opts,
        ...p,
      })
    );
  }

  public async depositGenericNft(p: {
    safe: ObjectId;
    nft: ObjectId;
    collection: string;
  }) {
    return this.client.sendTxWaitForEffects(
      depositGenericNftTx({
        ...this.opts,
        ...p,
      })
    );
  }

  public async depositNftPrivileged(p: {
    safe: ObjectId;
    nft: ObjectId;
    ownerCap: ObjectId;
    collection: string;
  }) {
    return this.client.sendTxWaitForEffects(
      depositNftPrivilegedTx({
        ...this.opts,
        ...p,
      })
    );
  }

  public async depositNft(p: {
    safe: ObjectId;
    nft: ObjectId;
    collection: string;
  }) {
    return this.client.sendTxWaitForEffects(
      depositNftTx({
        ...this.opts,
        ...p,
      })
    );
  }

  public async disableDepositsOfCollection(p: {
    safe: ObjectId;
    collection: string;
    ownerCap: ObjectId;
  }) {
    return this.client.sendTxWaitForEffects(
      disableDepositsOfCollectionTx({
        ...this.opts,
        ...p,
      })
    );
  }

  public async enableDepositsOfCollection(p: {
    safe: ObjectId;
    collection: string;
    ownerCap: ObjectId;
  }) {
    return this.client.sendTxWaitForEffects(
      enableDepositsOfCollectionTx({
        ...this.opts,
        ...p,
      })
    );
  }

  public async enableAnyDeposit(p: { safe: ObjectId; ownerCap: ObjectId }) {
    return this.client.sendTxWaitForEffects(
      enableAnyDepositTx({
        ...this.opts,
        ...p,
      })
    );
  }

  public async restrictDeposits(p: { safe: ObjectId; ownerCap: ObjectId }) {
    return this.client.sendTxWaitForEffects(
      restrictDepositsTx({
        ...this.opts,
        ...p,
      })
    );
  }
}
