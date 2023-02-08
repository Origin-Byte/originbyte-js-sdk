import {
  Ed25519Keypair,
  ObjectId,
  Provider,
  TransactionEffects,
} from "@mysten/sui.js";
import { FullClient } from "../FullClient";
import { GlobalParams } from "../types";
import { parseObjectOwner } from "../utils";
import { SafeReadClient } from "./SafeReadClient";
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
    super(client, opts);
  }

  public static fromKeypair(
    keypair: Ed25519Keypair,
    provider?: Provider,
    opts?: Partial<GlobalParams>
  ) {
    return new SafeFullClient(FullClient.fromKeypair(keypair, provider), opts);
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

  public async createExclusiveTransferCapForSender(p: {
    safe: ObjectId;
    ownerCap: ObjectId;
    nft: ObjectId;
  }): Promise<{ transferCap: ObjectId; effects: TransactionEffects }> {
    const effects = await this.client.sendTxWaitForEffects(
      createExclusiveTransferCapForSenderTx({
        ...this.opts,
        ...p,
      })
    );

    return SafeFullClient.parseExclusiveTransferCapForSenderTxData(effects)
  }

  public static parseExclusiveTransferCapForSenderTxData(effects: TransactionEffects) {
    // there's always exactly one object created in this tx
    return { transferCap: effects.created[0].reference.objectId, effects };
  }

  public async createSafeForSender(): Promise<{
    safe: ObjectId;
    ownerCap: ObjectId;
    effects: TransactionEffects;
  }> {
    const effects = await this.client.sendTxWaitForEffects(
      createSafeForSenderTx(this.opts)
    );

    return SafeFullClient.parseCreateSafeForSenderTxData(effects)
  }

  public static parseCreateSafeForSenderTxData(effects: TransactionEffects) {
    const [object1, object2] = effects.created;

    let safe;
    let ownerCap;

    // two objects are created, one is the safe which is a shared object,
    // the other is the owner cap which is owned by the sender
    if (parseObjectOwner(object1.owner) === "shared") {
      safe = object1.reference.objectId;
      ownerCap = object2.reference.objectId;
    } else {
      safe = object2.reference.objectId;
      ownerCap = object1.reference.objectId;
    }

    return { safe, ownerCap, effects };
  }

  public async createTransferCapForSender(p: {
    safe: ObjectId;
    ownerCap: ObjectId;
    nft: ObjectId;
  }) {
    const effects = await this.client.sendTxWaitForEffects(
      createTransferCapForSenderTx({
        ...this.opts,
        ...p,
      })
    );

    // there's always exactly one object created in this tx
    return { transferCap: effects.created[0].reference.objectId, effects };
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
