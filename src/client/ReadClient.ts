import { JsonRpcProvider, Provider } from "@mysten/sui.js";
import { TESTNET_URL } from "./consts";

export class ReadClient {
  // eslint-disable-next-line
  constructor(public provider: Provider = new JsonRpcProvider(TESTNET_URL)) {
    //
  }

  public static fromRpcUrl(url: string) {
    return new ReadClient(new JsonRpcProvider(url));
  }
}
