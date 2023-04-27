import {
  Ed25519Keypair,
  ObjectId,
  JsonRpcProvider,
  SuiAddress,
} from "@mysten/sui.js";
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
  newOrderbookTx,
  finishTradeTx,
  editAskTx,
  editBidTx,
  createProtectionTx,
  CreateProtectionParams,
  createUnprotectedOrderbookTx,
  createUnprotectedTx,
  shareOrderbookTx,
  marketBuyTx,
  marketSellTx,
} from "./txBuilder";

import { TransactionResult } from "../../transaction";

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
    provider?: JsonRpcProvider,
    opts?: Partial<GlobalParams>
  ) {
    return new OrderbookFullClient(
      FullClient.fromKeypair(keypair, provider),
      opts
    );
  }

  static newOrderbookTx = newOrderbookTx;

  static createUnprotectedOrderbookTx = createUnprotectedOrderbookTx;

  static createUnprotectedTx = createUnprotectedTx;

  static shareOrderbookTx = shareOrderbookTx;

  static createProtectionTx = createProtectionTx;

  static createAskTx = createAskTx;

  static createAskWithCommissionTx = createAskWithCommissionTx;

  static cancelAskTx = cancelAskTx;

  static editAskTx = editAskTx;

  static editBidTx = editBidTx;

  static createBidTx = createBidTx;

  static createBidWithCommissionTx = createBidWithCommissionTx;

  static cancelBidTx = cancelBidTx;

  static buyNftTx = buyNftTx;

  static finishTradeTx = finishTradeTx;

  static marketBuyTx = marketBuyTx;

  static marketSellTx = marketSellTx;

  public async createProtection(p: CreateProtectionParams) {
    const effects = await this.client.sendTxWaitForEffects(
      createProtectionTx({
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
    sellersKiosk: ObjectId | TransactionResult;
    price: number;
    nft: ObjectId;
  }) {
    const effects = await this.client.sendTxWaitForEffects(
      createAskTx({
        ...this.opts,
        ...p,
      })
    );

    return effects;
  }

  public async createAskWithCommission(p: {
    collection: string;
    orderbook: ObjectId;
    price: number;
    sellersKiosk: ObjectId | TransactionResult;
    nft: ObjectId;
    ft: string;
    beneficiary: SuiAddress;
    commission: number;
  }) {
    const effects = await this.client.sendTxWaitForEffects(
      createAskWithCommissionTx({
        ...this.opts,
        ...p,
      })
    );

    return effects;
  }

  public async buyNft(p: {
    orderbook: ObjectId;
    sellersKiosk: ObjectId | TransactionResult;
    buyersKiosk: ObjectId | TransactionResult;
    collection: string;
    ft: string;
    nft: ObjectId;
    price: number;
    wallet: ObjectId | TransactionResult;
  }) {
    const effects = await this.client.sendTxWaitForEffects(
      buyNftTx({
        ...this.opts,
        ...p,
      })
    );

    return effects;
  }

  public async cancelAsk(p: {
    orderbook: ObjectId;
    sellersKiosk: ObjectId | TransactionResult;
    price: number;
    nft: ObjectId;
    collection: string;
    ft: string;
  }) {
    return this.client.sendTxWaitForEffects(
      cancelAskTx({
        ...this.opts,
        ...p,
      })
    );
  }

  public async editAsk(p: {
    orderbook: ObjectId;
    sellersKiosk: ObjectId | TransactionResult;
    collection: string;
    ft: string;
    nft: ObjectId;
    oldPrice: number;
    newPrice: number;
  }) {
    return this.client.sendTxWaitForEffects(
      editAskTx({
        ...this.opts,
        ...p,
      })
    );
  }

  public async editBid(p: {
    orderbook: ObjectId;
    buyersKiosk: ObjectId | TransactionResult;
    collection: string;
    ft: string;
    oldPrice: number;
    newPrice: number;
    wallet: ObjectId | TransactionResult;
  }) {
    return this.client.sendTxWaitForEffects(
      editBidTx({
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
    wallet: ObjectId | TransactionResult;
  }) {
    return this.client.sendTxWaitForEffects(
      cancelBidTx({
        ...this.opts,
        ...p,
      })
    );
  }

  public async finishTrade(p: {
    orderbook: ObjectId;
    collection: string;
    ft: string;
    buyersKiosk: ObjectId | TransactionResult;
    sellersKiosk: ObjectId | TransactionResult;
    trade: ObjectId;
  }) {
    const effects = await this.client.sendTxWaitForEffects(
      finishTradeTx({
        ...this.opts,
        ...p,
      })
    );

    return effects;
  }

  public async createBid(p: {
    buyersKiosk: ObjectId | TransactionResult;
    collection: string;
    ft: string;
    orderbook: ObjectId;
    price: number;
    wallet: ObjectId | TransactionResult;
  }) {
    const effects = await this.client.sendTxWaitForEffects(
      createBidTx({
        ...this.opts,
        ...p,
      })
    );

    return effects;
  }

  public async createBidWithCommission(p: {
    orderbook: ObjectId;
    buyersKiosk: ObjectId | TransactionResult;
    collection: string;
    ft: string;
    price: number;
    wallet: ObjectId | TransactionResult;
    beneficiary: SuiAddress;
    commission: number;
  }) {
    const effects = await this.client.sendTxWaitForEffects(
      createBidWithCommissionTx({
        ...this.opts,
        ...p,
      })
    );

    return effects;
  }

  public async marketBuy(p: {
    orderbook: ObjectId;
    buyersKiosk: ObjectId | TransactionResult;
    wallet: ObjectId | TransactionResult;
    price: number;
    collection: string;
    ft: string;
  }) {
    const effects = await this.client.sendTxWaitForEffects(
      marketBuyTx({
        ...this.opts,
        ...p,
      })
    );

    return effects;
  }

  public async marketSell(p: {
    orderbook: ObjectId;
    sellersKiosk: ObjectId | TransactionResult;
    price: number;
    nft: ObjectId;
    collection: string;
    ft: string;
  }) {
    const effects = await this.client.sendTxWaitForEffects(
      marketSellTx({
        ...this.opts,
        ...p,
      })
    );

    return effects;
  }
}
