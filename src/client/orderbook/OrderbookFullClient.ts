import {
  Ed25519Keypair,
  ObjectId,
  Provider,
  SuiAddress,
  TransactionEffects,
} from "@mysten/sui.js";
import { FullClient } from "../FullClient";
import { GlobalParams } from "../types";
import { parseObjectOwner } from "../utils";
import { OrderbookReadClient } from "./OrderbookReadClient";
import {
  buyGenericNftTx,
  buyNftTx,
  cancelAskTx,
  cancelBidTx,
  createAskTx,
  createAskWithCommissionTx,
  createBidTx,
  createBidWithCommissionTx,
  createOrderbookTx,
  finishTradeOfGenericNftTx,
  finishTradeTx,
  listNftTx,
  depositAndlistNftTx,
  createSafeAndDepositAndListNftTx,
  depositAndListNftWithCommissionTx,
  createSafeAndDepositAndListNftWithCommissionTx,
  createSafeAndBuyNftTx,
  cancelAskAndDiscardTransferCapTx,
  editAskTx,
  listNftWithCommissionTx,
  listMultipleNftsWithCommissionTx,
  editBidTx,
  createSafeAndBidWithCommissionTx,
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

  static listNftTx = listNftTx;

  static listNftWithCommissionTx = listNftWithCommissionTx;

  static listMultipleNftsWithCommissionTx = listMultipleNftsWithCommissionTx;

  static depositAndlistNftTx = depositAndlistNftTx;

  static createSafeAndDepositAndListNftTx = createSafeAndDepositAndListNftTx;

  static depositAndListNftWithCommissionTx = depositAndListNftWithCommissionTx;

  static createSafeAndDepositAndListNftWithCommissionTx =
    createSafeAndDepositAndListNftWithCommissionTx;

  static buyNftTx = buyNftTx;

  static createSafeAndBuyNftTx = createSafeAndBuyNftTx;

  static buyGenericNftTx = buyGenericNftTx;

  static cancelAskTx = cancelAskTx;

  static cancelAskAndDiscardTransferCapTx = cancelAskAndDiscardTransferCapTx;

  static editAskTx = editAskTx;

  static editBidTx = editBidTx;

  static finishTradeTx = finishTradeTx;

  static finishTradeOfGenericNft = finishTradeOfGenericNftTx;

  static createBidTx = createBidTx;

  static createBidWithCommissionTx = createBidWithCommissionTx;

  static createSafeAndBidWithCommissionTx = createSafeAndBidWithCommissionTx;

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

  public async listNft(p: {
    collection: string;
    ft: string;
    orderbook: ObjectId;
    price: number;
    nft: ObjectId;
    sellerSafe: ObjectId;
    ownerCap: ObjectId;
  }) {
    const effects = await this.client.sendTxWaitForEffects(
      listNftTx({
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

  public async listNftWithCommission(p: {
    beneficiary: SuiAddress;
    commission: number;
    collection: string;
    ft: string;
    orderbook: ObjectId;
    price: number;
    nft: ObjectId;
    sellerSafe: ObjectId;
    ownerCap: ObjectId;
  }) {
    const effects = await this.client.sendTxWaitForEffects(
      listNftWithCommissionTx({
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

  public async listMultipleNftsWithCommission(p: {
    beneficiary: SuiAddress;
    commissions: number[];
    collection: string;
    ft: string;
    orderbook: ObjectId;
    prices: number[];
    nfts: ObjectId[];
    sellerSafe: ObjectId;
    ownerCap: ObjectId;
  }) {

    if (!(p.commissions.length === p.nfts.length && p.prices.length === p.nfts.length)) {
      throw new Error("The length of provided lists (commissions & nfts & prices) do not match with each together")
    }

    return this.client.sendTxWaitForEffects(
      listMultipleNftsWithCommissionTx({
        ...this.opts,
        ...p,
      })
    );
  }

  public async depositAndListNft(p: {
    collection: string;
    ft: string;
    nftType: string;
    orderbook: ObjectId;
    price: number;
    nft: ObjectId;
    sellerSafe: ObjectId;
    ownerCap: ObjectId;
  }) {
    const effects = await this.client.sendTxWaitForEffects(
      depositAndlistNftTx({
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

  public async depositAndListNftWithCommission(p: {
    beneficiary: SuiAddress;
    commission: number;
    collection: string;
    ft: string;
    nftType: string;
    orderbook: ObjectId;
    price: number;
    nft: ObjectId;
    sellerSafe: ObjectId;
    ownerCap: ObjectId;
  }) {
    const effects = await this.client.sendTxWaitForEffects(
      depositAndListNftWithCommissionTx({
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

  public async createSafeAndDepositAndListNft(p: {
    collection: string;
    ft: string;
    nftType: string;
    orderbook: ObjectId;
    price: number;
    nft: ObjectId;
  }) {
    const effects = await this.client.sendTxWaitForEffects(
      createSafeAndDepositAndListNftTx({
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

  public async createSafeAndDepositAndListNftWithCommission(p: {
    beneficiary: SuiAddress;
    commission: number;
    collection: string;
    ft: string;
    nftType: string;
    orderbook: ObjectId;
    price: number;
    nft: ObjectId;
  }) {
    const effects = await this.client.sendTxWaitForEffects(
      createSafeAndDepositAndListNftWithCommissionTx({
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
  }): Promise<{ tradePayments: ObjectId[]; effects: TransactionEffects }> {
    const effects = await this.client.sendTxWaitForEffects(
      buyNftTx({
        ...this.opts,
        ...p,
      })
    );

    const tradePayments = effects.created
      .filter((obj) => parseObjectOwner(obj.owner) === "shared")
      .map((obj) => obj.reference.objectId);

    return {
      tradePayments,
      effects,
    };
  }

  public async createSafeAndBuyNft(p: {
    allowlist: ObjectId;
    collection: string;
    ft: string;
    nft: ObjectId;
    orderbook: ObjectId;
    price: number;
    sellerSafe: ObjectId;
    wallet: ObjectId;
  }): Promise<{ tradePayments: ObjectId[]; effects: TransactionEffects }> {
    const effects = await this.client.sendTxWaitForEffects(
      createSafeAndBuyNftTx({
        ...this.opts,
        ...p,
      })
    );

    const tradePayments = effects.created
      .filter((obj) => parseObjectOwner(obj.owner) === "shared")
      .map((obj) => obj.reference.objectId);

    return {
      tradePayments,
      effects,
    };
  }

  public async buyGenericNft(p: {
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
      buyGenericNftTx({
        ...this.opts,
        ...p,
      })
    );

    return {
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

  public async cancelAskAndDiscardTransferCap(p: {
    collection: string;
    ft: string;
    nft: ObjectId;
    orderbook: ObjectId;
    price: number;
    sellerSafe: ObjectId;
  }) {
    return this.client.sendTxWaitForEffects(
      cancelAskAndDiscardTransferCapTx({
        ...this.opts,
        ...p,
      })
    );
  }

  public async editAsk(p: {
    collection: string;
    ft: string;
    nft: ObjectId;
    orderbook: ObjectId;
    oldPrice: number;
    newPrice: number;
    sellerSafe: ObjectId;
  }) {
    return this.client.sendTxWaitForEffects(
      editAskTx({
        ...this.opts,
        ...p,
      })
    );
  }

  public async editBid(p: {
    collection: string;
    ft: string;
    orderbook: ObjectId;
    oldPrice: number;
    newPrice: number;
    buyerSafe: ObjectId;
    wallet: ObjectId;
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
  }): Promise<{ tradePayments: ObjectId[]; effects: TransactionEffects }> {
    const effects = await this.client.sendTxWaitForEffects(
      finishTradeTx({
        ...this.opts,
        ...p,
      })
    );

    const tradePayments = effects.created
      .filter((obj) => parseObjectOwner(obj.owner) === "shared")
      .map((obj) => obj.reference.objectId);

    return { tradePayments, effects };
  }

  public async finishTradeOfGenericNft(p: {
    buyerSafe: ObjectId;
    collection: string;
    ft: string;
    sellerSafe: ObjectId;
    trade: ObjectId;
  }) {
    return this.client.sendTxWaitForEffects(
      finishTradeOfGenericNftTx({
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

  public async createSafeAndBidWithCommission(p: {
    beneficiary: SuiAddress;
    collection: string;
    commission: number;
    ft: string;
    orderbook: ObjectId;
    price: number;
    wallet: ObjectId;
  }) {
    return this.client.sendTxWaitForEffects(
      createSafeAndBidWithCommissionTx({
        ...this.opts,
        ...p,
      })
    );
  }
}
