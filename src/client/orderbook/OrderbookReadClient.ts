import { ObjectId, Provider, SuiAddress } from "@mysten/sui.js";
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
}
