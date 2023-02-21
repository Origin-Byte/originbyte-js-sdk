import { ObjectId, Provider, SuiAddress, TransactionEffects } from "@mysten/sui.js";
import {
  DEFAULT_GAS_BUDGET,
  DEFAULT_PACKAGE_ID,
  DEFAULT_SAFE_MODULE,
} from "../consts";
import { ReadClient } from "../ReadClient";
import { GlobalParams } from "../types";
import { parseObjectOwner } from "../utils";

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
  isGeneric: boolean;
}

export function transformTransferCap({ fields }: any): TransferCapState {
  return {
    safe: fields.safe,
    isExclusivelyListed: fields.inner.fields.is_exclusive,
    isGeneric: fields.inner.fields.is_generic,
    nft: fields.inner.fields.nft,
    version: fields.inner.fields.version,
  };
}

export function parseCreateSafeForSenderTxData(effects: TransactionEffects) {
  const [object1, object2] = effects.created;

  let safe;
  let ownerCap;

  // two objects are created, one is the safe which is a shared object,
  // the other is the owner cap which is owned by the sender
  if (parseObjectOwner(object1.owner) === "shared") {
    safe = object1.reference.objectId;
    ownerCap = object2.reference.objectId;
  } else {
    safe = object2.reference.objectId;
    ownerCap = object1.reference.objectId;
  }

  return { safe, ownerCap };
}

export function parseTransferCapForSenderTxData(effects: TransactionEffects) {
  // there's always exactly one object created in this tx
  return { transferCap: effects.created[0].reference.objectId };
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

  public async fetchOwnerCapsIds(
    user: SuiAddress,
    p: Partial<GlobalParams> = {}
  ): Promise<ObjectId[]> {
    const ownerCapType = `${p.packageObjectId || this.package}::${
      p.moduleName || this.module
    }::OwnerCap`;
    const objs = await this.client.getObjects(user);
    return objs.filter((o) => o.type === ownerCapType).map((o) => o.objectId);
  }

  public async fetchAllOwnerCapsByUser(user: SuiAddress) {
    const allObjects = await this.client.getObjects(user);
    const ownerCapObjects = allObjects.filter((obj) => obj.type.endsWith("::OwnerCap"));

    return ownerCapObjects
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
