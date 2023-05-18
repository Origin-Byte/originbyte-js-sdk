import { JsonRpcProvider, ObjectId, SuiAddress } from "@mysten/sui.js";
import { ReadClient } from "../ReadClient";
import { GlobalParams } from "../types";
import { DEFAULT_KIOSK_MODULE, DEFAULT_PACKAGE_ID } from "../consts";
import { Kiosk, OwnerToken } from "./types";

const KIOSK_ITEM_TYPE = "0x0000000000000000000000000000000000000000000000000000000000000002::kiosk::Item";

export class KioskReadClient {
  // eslint-disable-next-line
  constructor(
    // eslint-disable-next-line
    public client: ReadClient = new ReadClient(),
    // eslint-disable-next-line
    public opts: Partial<GlobalParams> = {}
  ) {
    //
  }

  public static fromProvider(provider: JsonRpcProvider, opts: Partial<GlobalParams>) {
    return new KioskReadClient(new ReadClient(provider), opts);
  }

  public static fromRpcUrl(url: string, opts: Partial<GlobalParams>) {
    return new KioskReadClient(ReadClient.fromRpcUrl(url), opts);
  }

  public get package() {
    return this.opts.packageObjectId ?? DEFAULT_PACKAGE_ID;
  }

  public get module() {
    return this.opts.moduleName ?? DEFAULT_KIOSK_MODULE;
  }

  public async fetchOwnerTokens(
    user: SuiAddress,
    p: Partial<GlobalParams> = {}
  ): Promise<OwnerToken[]> {
    const ownerTokenType = `::${p.moduleName || this.module
      }::OwnerToken`;
    const objs = (await this.client.getObjects(user, {
      showType: true,
      showContent: true
    }, {
      Package: p.packageObjectId || this.package
    }));
    return objs
      .filter((o) => o.data.type.endsWith(ownerTokenType))
      .map((o) => (o.data.content as any)?.fields as OwnerToken);
  }

  public async fetchSafeByOwnerCap(walletAddress: SuiAddress) {
    const kioskId = (await this.fetchOwnerTokens(walletAddress))[0].kiosk;
    return this.fetchKiosk(kioskId);
  }

  public async getWalletKiosks(user: SuiAddress, p: Partial<GlobalParams> = {}): Promise<Kiosk[]> {
    return Promise.all((await this.fetchOwnerTokens(user, p)).map(async (ot) => this.fetchKiosk(ot.kiosk)));
  }

  public async getWalletKiosk(user: SuiAddress, p: Partial<GlobalParams> = {}): Promise<Kiosk | undefined> {
    const ownerTokens = await this.fetchOwnerTokens(user, p);
    if (ownerTokens.length > 0) {
      return this.fetchKiosk(ownerTokens[0].kiosk);
    }
    return undefined;
  }

  public async getWalletKioskId(user: SuiAddress, p: Partial<GlobalParams> = {}) {
    const ownerTokens = await this.fetchOwnerTokens(user, p);
    if (ownerTokens.length > 0) {
      return ownerTokens[0].kiosk;
    }
    return undefined;
  }

  /*
  Returns all the nfts for a specific kiosks
  */
  public async getKioskNfts(kioskId: ObjectId, p: Partial<GlobalParams> = {}) {
    const kiosk = await this.client.getDynamicFields(kioskId);
    return kiosk.filter((item) =>
      item.name.type === KIOSK_ITEM_TYPE
    ).map((item) => ({ kioskId, nft: item.name.value.id }));
  }

  /*
  Returns all the nfts that are contained in every kiosk connected to a specific address
  */
  public async getAllNftKioskAssociations(user: SuiAddress, p: Partial<GlobalParams> = {}) {
    const kiosks = await this.getWalletKiosks(user, p);
    return (await Promise.all(kiosks.map((kiosk) => this.getKioskNfts((kiosk.id as any).id)))).flat();
  }

  public async fetchKiosk(kioskId: ObjectId): Promise<Kiosk> {
    const details = await this.client.getObject(kioskId);
    if (typeof details !== "object" || !("content" in details) || !("fields" in details.content)) {
      throw new Error("Cannot fetch owner cap details");
    }

    return details.content.fields as Kiosk;
  }

}
