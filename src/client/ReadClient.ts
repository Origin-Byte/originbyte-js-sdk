import {
  Connection,
  JsonRpcProvider,
  ObjectId,
  SuiAddress,
  SuiObjectDataFilter,
  SuiObjectDataOptions,
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

  public async getObjects(owner: SuiAddress, options?: SuiObjectDataOptions, filter?: SuiObjectDataFilter) {
    const items = [];
    // eslint-disable-next-line prefer-const
    let {hasNextPage, nextCursor, data} = await this.getPaginatedObjects(owner, filter, options); 
    items.push(...data);
    while (hasNextPage) {
      // eslint-disable-next-line no-await-in-loop
      const result = await this.getPaginatedObjects(owner, filter, options, nextCursor);
      hasNextPage = result.hasNextPage;
      nextCursor = result.nextCursor;
      items.push(...result.data);
    } 
    return items;
  }

  public async getPaginatedObjects(owner: SuiAddress, filter?: SuiObjectDataFilter, options?: SuiObjectDataOptions, cursor: any = null) {
    return this.provider.getOwnedObjects({
      owner,
      filter,
      cursor,
      options
    });
  }

  public async getObject(id: ObjectId) {
    const { data } = await this.provider.getObject({
      id,
      options: { showContent: true },
    });

    return data;
  }

  public async getDynamicFields(id: ObjectId) {
    const {data} = await this.provider.getDynamicFields({
      parentId: id,
    });
    return data;
  }
}
