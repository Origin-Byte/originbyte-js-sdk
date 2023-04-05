import {
  EventId,
  ObjectId,
  JsonRpcProvider,
  SubscriptionId,
  SuiAddress,
  CheckpointedObjectId,
  PaginatedEvents,
} from "@mysten/sui.js";
import { DEFAULT_ORDERBOOK_MODULE, DEFAULT_PAGINATION_LIMIT } from "../consts";
import { ReadClient } from "../ReadClient";
import { TransferCapState, transformTransferCap } from "../safe/SafeReadClient";

export interface ProtectedActions {
  buyNft: boolean;
  cancelAsk: boolean;
  cancelBid: boolean;
  createAsk: boolean;
  createBid: boolean;
}

export interface AskCommissionState {
  beneficiary: SuiAddress;
  cut: number;
}

export interface AskState {
  owner: SuiAddress;
  price: number;
  transferCap: TransferCapState;
  commission?: AskCommissionState;
}

export interface BidState {
  offer: number;
  owner: SuiAddress;
  safe: ObjectId;
  commission?: {
    beneficiary: SuiAddress;
    cut: number;
  };
}

export interface OrderbookState {
  protectedActions: ProtectedActions;
  asks: AskState[];
  bids: BidState[];
}

export type OrderbookEvent =
  | {
      BidCreatedEvent: {
        orderbook: ObjectId;
        owner: SuiAddress;
        price: number;
      };
    }
  | {
      AskCreatedEvent: {
        nft: ObjectId;
        orderbook: ObjectId;
        owner: SuiAddress;
        price: number;
        safe: ObjectId;
      };
    }
  | {
      BidClosedEvent: {
        orderbook: ObjectId;
        owner: SuiAddress;
        price: number;
      };
    }
  | {
      AskClosedEvent: {
        nft: ObjectId;
        orderbook: ObjectId;
        owner: SuiAddress;
        price: number;
      };
    }
  | {
      OrderbookCreatedEvent: {
        collectionType: string;
        ftType: string;
        orderbook: ObjectId;
      };
    };

interface TradeIntermediaryState {
  paid: number;
  buyer: SuiAddress;
  buyerSafe: ObjectId;
  commission?: AskCommissionState;
  transferCap?: TransferCapState;
}

export function parseCommission(fields: any): AskCommissionState | undefined {
  return fields === null
    ? undefined
    : {
        beneficiary: fields.beneficiary,
        cut: parseInt(fields.cut, 10),
      };
}

type Unpacked<T> = T extends (infer U)[] ? U : T;

type Envelope = Unpacked<PaginatedEvents["data"]>;

function parseOrderbookEvent(e: Envelope): OrderbookEvent | null {
  const { type, parsedJson: fields } = e;

  if (type.endsWith("BidCreatedEvent")) {
    return {
      BidCreatedEvent: {
        orderbook: fields.orderbook,
        owner: fields.owner,
        price: parseInt(fields.price, 10),
      },
    };
  }
  if (type.endsWith("BidClosedEvent")) {
    return {
      BidClosedEvent: {
        orderbook: fields.orderbook,
        owner: fields.owner,
        price: parseInt(fields.price, 10),
      },
    };
  }
  if (type.endsWith("AskCreatedEvent")) {
    return {
      AskCreatedEvent: {
        nft: fields.nft,
        orderbook: fields.orderbook,
        owner: fields.owner,
        price: parseInt(fields.price, 10),
        safe: fields.safe,
      },
    };
  }
  if (type.endsWith("AskClosedEvent")) {
    return {
      AskClosedEvent: {
        nft: fields.nft,
        orderbook: fields.orderbook,
        owner: fields.owner,
        price: parseInt(fields.price, 10),
      },
    };
  }
  if (type.endsWith("OrderbookCreatedEvent")) {
    return {
      OrderbookCreatedEvent: {
        collectionType: fields.collection_type,
        ftType: fields.fungible_token_type,
        orderbook: fields.orderbook,
      },
    };
  }

  // eslint-disable-next-line no-console
  console.warn(`Unknown orderbook event in tx '${e.id}'`);
  return null;
}

export class OrderbookReadClient {
  // eslint-disable-next-line
  constructor(public client: ReadClient = new ReadClient()) {
    //
  }

  public static fromProvider(provider: JsonRpcProvider) {
    return new OrderbookReadClient(new ReadClient(provider));
  }

  public static fromRpcUrl(url: string) {
    return new OrderbookReadClient(ReadClient.fromRpcUrl(url));
  }

  /**
   * If sorted, then asks are sorted by price in ascending order and bids are
   * sorted by price in descending order.
   */
  public async fetchOrderbook(
    orderbookId: ObjectId,
    sort: boolean = false
  ): Promise<OrderbookState> {
    const details = await this.client.getObject(orderbookId);

    if (typeof details !== "object" || !("data" in details)) {
      throw new Error("Cannot fetch owner cap details");
    }

    const { fields } = details.data as any;

    const protectedActions = {
      buyNft: fields.protected_actions.fields.buy_nft,
      cancelAsk: fields.protected_actions.fields.cancel_ask,
      cancelBid: fields.protected_actions.fields.cancel_bid,
      createAsk: fields.protected_actions.fields.create_ask,
      createBid: fields.protected_actions.fields.create_bid,
    };

    const asks: AskState[] = [];
    fields.asks.fields.o.forEach((priceLevel: any) => {
      const price = parseInt(priceLevel.fields.k, 10);
      asks.push(
        ...priceLevel.fields.v.map((a: any) => {
          return {
            owner: a.fields.owner,
            price,
            transferCap: transformTransferCap(a.fields.transfer_cap),
            commission: a.fields.commission
              ? {
                  beneficiary: a.fields.commission.fields.beneficiary,
                  cut: parseInt(a.fields.commission.fields.cut, 10),
                }
              : undefined,
          };
        })
      );
    });

    const bids: BidState[] = [];
    fields.bids.fields.o.forEach((priceLevel: any) => {
      const offer = parseInt(priceLevel.fields.k, 10);
      bids.push(
        ...priceLevel.fields.v.map((b: any) => {
          return {
            offer,
            owner: b.fields.owner,
            safe: b.fields.safe,
            commission: b.fields.commission
              ? {
                  beneficiary: b.fields.commission.fields.beneficiary,
                  cut: parseInt(b.fields.commission.fields.cut, 10),
                }
              : undefined,
          };
        })
      );
    });

    if (sort) {
      asks.sort((a, b) => a.price - b.price);
      bids.sort((a, b) => b.offer - a.offer);
    }

    return {
      asks,
      bids,
      protectedActions,
    };
  }

  public async fetchTradeIntermediary(
    trade: ObjectId
  ): Promise<TradeIntermediaryState> {
    const details = await this.client.getObject(trade);

    if (typeof details !== "object" || !("data" in details)) {
      throw new Error("Cannot fetch trade intermediary details");
    }

    const { fields } = details.data as any;
    return {
      buyer: fields.buyer,
      buyerSafe: fields.buyer_safe,
      paid: parseInt(fields.paid, 10),
      commission: parseCommission(fields.commission),
      transferCap: fields.transfer_cap
        ? transformTransferCap(fields.transfer_cap)
        : undefined,
    };
  }

  public async fetchEvents(p: {
    packageId: ObjectId;
    module?: string;
    cursor?: CheckpointedObjectId | ObjectId | null;
    limit?: number; // or DEFAULT_PAGINATION_LIMIT
    order?: "ascending" | "descending";
  }): Promise<{
    events: Array<{
      txDigest: string;
      data: OrderbookEvent;
    }>;
    nextCursor: EventId | null;
  }> {
    const { data, nextCursor } = await this.client.provider.queryEvents({
      query: {
        MoveModule: {
          package: p.packageId,
          module: p.module || DEFAULT_ORDERBOOK_MODULE,
        },
      },
      cursor: p.cursor || null,
      limit: p.limit || DEFAULT_PAGINATION_LIMIT,
      order: p.order || "ascending",
    });

    return {
      events: data
        .map((envelope) => {
          return {
            txDigest: envelope.id.txDigest,
            data: parseOrderbookEvent(envelope),
          };
        })
        .filter((e) => e.data !== null),
      nextCursor,
    };
  }

  public subscribeToEvents(
    p: { packageId: ObjectId; module?: string },
    // eslint-disable-next-line
    cb: (event: OrderbookEvent) => void
  ): Promise<SubscriptionId> {
    return this.client.provider.subscribeEvent({
      filter: {
        All: [
          {
            MoveModule: {
              package: p.packageId,
              module: p.module || DEFAULT_ORDERBOOK_MODULE,
            },
          },
          { MoveEventType: "MoveEvent" },
        ],
      },
      onMessage: (envelope) => {
        const parsedEvent = parseOrderbookEvent(envelope);
        if (parsedEvent) {
          cb(parsedEvent);
        }
      },
    });
  }
}
