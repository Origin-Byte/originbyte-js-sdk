import { JsonRpcProvider, Provider } from "@mysten/sui.js";

const TESTNET_URL = "https://fullnode.devnet.sui.io";

export class ReadClient {
  // eslint-disable-next-line
  constructor(public provider: Provider = new JsonRpcProvider(TESTNET_URL)) {
    //
  }

  public static fromRpcUrl(url: string) {
    return new ReadClient(new JsonRpcProvider(url));
  }
}
