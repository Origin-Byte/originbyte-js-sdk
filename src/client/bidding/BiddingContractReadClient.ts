import { JsonRpcProvider } from "@mysten/sui.js";
import { ReadClient } from "../ReadClient";
import { GlobalParams } from "../types";
import { DEFAULT_KIOSK_MODULE, DEFAULT_PACKAGE_ID } from "../consts";

export class BiddingContractReadClient {
  // eslint-disable-next-line
  constructor(
    // eslint-disable-next-line
    public client: ReadClient = new ReadClient(),
    // eslint-disable-next-line
    public opts: Partial<GlobalParams> = {}
  ) {
    //
  }

  public static fromProvider(provider: JsonRpcProvider) {
    return new BiddingContractReadClient(new ReadClient(provider));
  }

  public static fromRpcUrl(url: string) {
    return new BiddingContractReadClient(ReadClient.fromRpcUrl(url));
  }

  public get package() {
    return this.opts.packageObjectId ?? DEFAULT_PACKAGE_ID;
  }

  public get module() {
    return this.opts.moduleName ?? DEFAULT_KIOSK_MODULE;
  }

}
