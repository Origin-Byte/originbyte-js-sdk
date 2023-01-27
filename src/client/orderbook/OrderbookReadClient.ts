import {
  EventId,
  ObjectId,
  Provider,
  SubscriptionId,
  SuiAddress,
  SuiEventEnvelope,
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

export interface AskState {
  owner: SuiAddress;
  price: number;
  transferCap: TransferCapState;
  commission?: {
    beneficiary: SuiAddress;
    cut: number;
  };
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
    };

function parseOrderbookEvent({
  txDigest,
  event,
}: SuiEventEnvelope): OrderbookEvent | null {
  if (!("moveEvent" in event)) {
    return null;
  }

  const { type, fields } = event.moveEvent;

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

  // eslint-disable-next-line no-console
  console.warn(`Unknown orderbook event in tx '${txDigest}'`);
  return null;
}

export class OrderbookReadClient {
  // eslint-disable-next-line
  constructor(public client: ReadClient = new ReadClient()) {
    //
  }

  public static fromProvider(provider: Provider) {
    return new OrderbookReadClient(new ReadClient(provider));
  }

  public static fromRpcUrl(url: string) {
    return new OrderbookReadClient(ReadClient.fromRpcUrl(url));
  }

  public async fetchOrderbook(orderbookId: ObjectId): Promise<OrderbookState> {
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

    return {
      asks,
      bids,
      protectedActions,
    };
  }

  public async fetchEvents(p: {
    packageId: ObjectId;
    module?: string;
    cursor?: EventId;
    limit?: number; // or DEFAULT_PAGINATION_LIMIT
    order?: "ascending" | "descending";
  }): Promise<{
    events: Array<{
      txDigest: string;
      data: OrderbookEvent;
    }>;
    nextCursor: EventId | null;
  }> {
    const { data, nextCursor } = await this.client.provider.getEvents(
      {
        MoveModule: {
          package: p.packageId,
          module: p.module || DEFAULT_ORDERBOOK_MODULE,
        },
      },
      p.cursor || null,
      p.limit || DEFAULT_PAGINATION_LIMIT,
      p.order || "ascending"
    );

    return {
      events: data
        .map((envelope) => {
          return {
            txDigest: envelope.txDigest,
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
    return this.client.provider.subscribeEvent(
      {
        All: [
          { Package: p.packageId },
          { Module: p.module || DEFAULT_ORDERBOOK_MODULE },
          { EventType: "MoveEvent" },
        ],
      },
      (envelope) => {
        const parsedEvent = parseOrderbookEvent(envelope);
        if (parsedEvent) {
          cb(parsedEvent);
        }
      }
    );
  }
}
