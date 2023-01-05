import { ObjectId, Provider, SuiAddress } from "@mysten/sui.js";
import {
  DEFAULT_GAS_BUDGET,
  DEFAULT_PACKAGE_ID,
  DEFAULT_SAFE_MODULE,
} from "../consts";
import { ReadClient } from "../ReadClient";
import { GlobalParams } from "../types";

export interface SafeState {
  id: ObjectId;
  collectionsWithEnabledDeposits: string[];
  enableAnyDeposits: boolean;
  nfts: Array<{
    id: ObjectId;
    version: string;
    isExclusivelyListed: boolean;
    transferCapsCount: number;
  }>;
}

export interface TransferCapState {
  safe: ObjectId;
  isExclusivelyListed: boolean;
  nft: ObjectId;
  version: string;
}

export function transformTransferCap({ fields }: any): TransferCapState {
  return {
    safe: fields.safe,
    isExclusivelyListed: fields.inner.fields.is_exclusive,
    nft: fields.inner.fields.nft,
    version: fields.inner.fields.version,
  };
}

export class SafeReadClient {
  // eslint-disable-next-line
  constructor(
    // eslint-disable-next-line
    public client: ReadClient = new ReadClient(),
    // eslint-disable-next-line
    public opts: Partial<GlobalParams> = {}
  ) {
    //
  }

  public static fromProvider(provider: Provider) {
    return new SafeReadClient(new ReadClient(provider));
  }

  public static fromRpcUrl(url: string) {
    return new SafeReadClient(ReadClient.fromRpcUrl(url));
  }

  public get package() {
    return this.opts.packageObjectId ?? DEFAULT_PACKAGE_ID;
  }

  public get module() {
    return this.opts.moduleName ?? DEFAULT_SAFE_MODULE;
  }

  public get gasBudget() {
    return this.opts.gasBudget ?? DEFAULT_GAS_BUDGET;
  }

  public async fetchOwnerCaps(
    user: SuiAddress,
    p: Partial<GlobalParams> = {}
  ): Promise<ObjectId[]> {
    const ownerCapType = `${p.packageObjectId || this.package}::${
      p.moduleName || this.module
    }::OwnerCap`;
    const objs = await this.client.getObjects(user);
    return objs.filter((o) => o.type === ownerCapType).map((o) => o.objectId);
  }

  public async fetchOwnerCapSafeId(ownerCap: ObjectId): Promise<ObjectId> {
    const details = await this.client.getObject(ownerCap);

    if (typeof details !== "object" || !("data" in details)) {
      throw new Error("Cannot fetch owner cap details");
    }

    return (details.data as any).fields.safe;
  }

  public async fetchSafeByOwnerCap(ownerCap: ObjectId) {
    const safeId = await this.fetchOwnerCapSafeId(ownerCap);
    return this.fetchSafe(safeId);
  }

  public async fetchSafe(safeId: ObjectId): Promise<SafeState> {
    const details = await this.client.getObject(safeId);

    if (typeof details !== "object" || !("data" in details)) {
      throw new Error("Cannot fetch owner cap details");
    }

    const { fields } = details.data as any;

    const refs = fields.inner.fields.refs.fields.contents;
    const nfts = refs.map((r: any) => ({
      id: r.fields.key,
      version: r.fields.value.fields.version,
      isExclusivelyListed: r.fields.value.fields.is_exclusively_listed,
      transferCapsCount: parseInt(
        r.fields.value.fields.transfer_cap_counter,
        10
      ),
    }));

    const collectionsWithEnabledDeposits =
      fields.collections_with_enabled_deposits.fields.contents.map(
        (o: any) => `0x${o.fields.name}`
      );

    return {
      id: safeId,
      enableAnyDeposits: fields.enable_any_deposit,
      collectionsWithEnabledDeposits,
      nfts,
    };
  }

  public async fetchTransferCap(
    transferCap: ObjectId
  ): Promise<TransferCapState> {
    const details = await this.client.getObject(transferCap);

    if (typeof details !== "object" || !("data" in details)) {
      throw new Error("Cannot fetch owner cap details");
    }

    return transformTransferCap(details.data as any);
  }
}
