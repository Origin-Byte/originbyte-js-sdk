import { Provider } from "@mysten/sui.js";
import { ReadClient } from "../ReadClient";

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
}
