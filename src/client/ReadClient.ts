import {
  JsonRpcProvider,
  ObjectId,
  Provider,
  SuiAddress,
} from "@mysten/sui.js";
import { TESTNET_URL } from "./consts";

export class ReadClient {
  // eslint-disable-next-line
  constructor(public provider: Provider = new JsonRpcProvider(TESTNET_URL)) {
    //
  }

  public static fromRpcUrl(url: string) {
    return new ReadClient(new JsonRpcProvider(url));
  }

  public getObjects(addr: SuiAddress) {
    return this.provider.getObjectsOwnedByAddress(addr);
  }

  public async getObject(id: ObjectId) {
    const { status, details } = await this.provider.getObject(id);

    if (status !== "Exists") {
      throw new Error(`Object '${id}' does not exist`);
    }

    return details;
  }
}
