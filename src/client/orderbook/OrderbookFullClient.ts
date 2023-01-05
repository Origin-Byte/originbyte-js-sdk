import { Ed25519Keypair, ObjectId, Provider, SuiAddress } from "@mysten/sui.js";
import { FullClient } from "../FullClient";
import { GlobalParams } from "../types";
import { OrderbookReadClient } from "./OrderbookReadClient";
import {
  buyNftTx,
  cancelAskTx,
  cancelBidTx,
  createAskTx,
  createAskWithCommissionTx,
  createBidTx,
  createBidWithCommissionTx,
  createOrderbookTx,
  finishTradeTx,
} from "./txBuilder";

export class OrderbookFullClient extends OrderbookReadClient {
  constructor(
    public client: FullClient,
    // eslint-disable-next-line
    public opts: Partial<GlobalParams> = {}
  ) {
    super(client);
  }

  public static fromKeypair(
    keypair: Ed25519Keypair,
    provider?: Provider,
    opts?: Partial<GlobalParams>
  ) {
    return new OrderbookFullClient(
      FullClient.fromKeypair(keypair, provider),
      opts
    );
  }

  static createOrderbookTx = createOrderbookTx;

  static createAskTx = createAskTx;

  static createAskWithCommissionTx = createAskWithCommissionTx;

  static buyNftTx = buyNftTx;

  static cancelAskTx = cancelAskTx;

  static finishTradeTx = finishTradeTx;

  static createBidTx = createBidTx;

  static createBidWithCommissionTx = createBidWithCommissionTx;

  static cancelBidTx = cancelBidTx;

  public async createOrderbook(p: { collection: string; ft: string }) {
    const effects = await this.client.sendTxWaitForEffects(
      createOrderbookTx({
        ...this.opts,
        ...p,
      })
    );

    return {
      orderbook: effects.created[0].reference.objectId,
      effects,
    };
  }

  public async createAsk(p: {
    collection: string;
    ft: string;
    orderbook: ObjectId;
    price: number;
    sellerSafe: ObjectId;
    transferCap: ObjectId;
  }) {
    const effects = await this.client.sendTxWaitForEffects(
      createAskTx({
        ...this.opts,
        ...p,
      })
    );

    return {
      // undefined if trade not executed instantly
      trade: effects.created?.find(Boolean)?.reference.objectId,
      effects,
    };
  }

  public async createAskWithCommission(p: {
    beneficiary: SuiAddress;
    collection: string;
    commission: number;
    ft: string;
    orderbook: ObjectId;
    price: number;
    sellerSafe: ObjectId;
    transferCap: ObjectId;
  }) {
    const effects = await this.client.sendTxWaitForEffects(
      createAskWithCommissionTx({
        ...this.opts,
        ...p,
      })
    );

    return {
      // undefined if trade not executed instantly
      trade: effects.created?.find(Boolean)?.reference.objectId,
      effects,
    };
  }

  public async buyNft(p: {
    allowlist: ObjectId;
    buyerSafe: ObjectId;
    collection: string;
    ft: string;
    nft: ObjectId;
    orderbook: ObjectId;
    price: number;
    sellerSafe: ObjectId;
    wallet: ObjectId;
  }) {
    const effects = await this.client.sendTxWaitForEffects(
      buyNftTx({
        ...this.opts,
        ...p,
      })
    );

    return {
      // undefined if trade not executed instantly
      trade: effects.created?.find(Boolean)?.reference.objectId,
      effects,
    };
  }

  public async cancelAsk(p: {
    collection: string;
    ft: string;
    nft: ObjectId;
    orderbook: ObjectId;
    price: number;
  }) {
    return this.client.sendTxWaitForEffects(
      cancelAskTx({
        ...this.opts,
        ...p,
      })
    );
  }

  public async cancelBid(p: {
    collection: string;
    ft: string;
    orderbook: ObjectId;
    price: number;
    wallet: ObjectId;
  }) {
    return this.client.sendTxWaitForEffects(
      cancelBidTx({
        ...this.opts,
        ...p,
      })
    );
  }

  public async finishTrade(p: {
    allowlist: ObjectId;
    buyerSafe: ObjectId;
    collection: string;
    ft: string;
    sellerSafe: ObjectId;
    trade: ObjectId;
  }) {
    return this.client.sendTxWaitForEffects(
      finishTradeTx({
        ...this.opts,
        ...p,
      })
    );
  }

  public async createBid(p: {
    buyerSafe: ObjectId;
    collection: string;
    ft: string;
    orderbook: ObjectId;
    price: number;
    wallet: ObjectId;
  }) {
    const effects = await this.client.sendTxWaitForEffects(
      createBidTx({
        ...this.opts,
        ...p,
      })
    );

    return {
      // undefined if trade not executed instantly
      trade: effects.created?.find(Boolean)?.reference.objectId,
      effects,
    };
  }

  public async createBidWithCommission(p: {
    beneficiary: SuiAddress;
    buyerSafe: ObjectId;
    collection: string;
    commission: number;
    ft: string;
    orderbook: ObjectId;
    price: number;
    wallet: ObjectId;
  }) {
    const effects = await this.client.sendTxWaitForEffects(
      createBidWithCommissionTx({
        ...this.opts,
        ...p,
      })
    );

    return {
      // undefined if trade not executed instantly
      trade: effects.created?.find(Boolean)?.reference.objectId,
      effects,
    };
  }
}
