import {
  Connection,
  JsonRpcProvider,
  ObjectId,
  SuiAddress,
} from "@mysten/sui.js";
import { TESTNET_URL } from "./consts";

export class ReadClient {
  // eslint-disable-next-line
  constructor(
    // eslint-disable-next-line
    public provider: JsonRpcProvider = new JsonRpcProvider(
      new Connection({ fullnode: TESTNET_URL })
    )
  ) {
    //
  }

  public static fromRpcUrl(url: string) {
    return new ReadClient(
      new JsonRpcProvider(new Connection({ fullnode: url }))
    );
  }

  public async getObjects(owner: SuiAddress) {
    const d = await this.provider.getOwnedObjects({ owner });
    return d.data;
  }

  public async getObject(id: ObjectId) {
    const { data } = await this.provider.getObject({ id, options: { showContent: true } });


    return data;
  }
}
