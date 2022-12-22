import { buyNftTx, createOrderbookTx, createAskTx } from "./txBuilder";

export class OrderbookClient {
  static createOrderbookTx = createOrderbookTx;

  static createAskTx = createAskTx;

  static buyNftTx = buyNftTx;
}
