import { Provider } from "@mysten/sui.js";
import { ReadClient } from "../ReadClient";

export class SafeReadClient {
  // eslint-disable-next-line
  constructor(public client: ReadClient = new ReadClient()) {
    //
  }

  public static fromProvider(provider: Provider) {
    return new SafeReadClient(new ReadClient(provider));
  }

  public static fromRpcUrl(url: string) {
    return new SafeReadClient(ReadClient.fromRpcUrl(url));
  }
}
