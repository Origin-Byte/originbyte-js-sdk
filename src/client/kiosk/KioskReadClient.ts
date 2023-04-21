import { JsonRpcProvider, ObjectId, SuiAddress } from "@mysten/sui.js";
import { ReadClient } from "../ReadClient";
import { GlobalParams } from "../types";
import { DEFAULT_KIOSK_MODULE, DEFAULT_PACKAGE_ID } from "../consts";
import { Kiosk, KioskNftItem, OwnerToken } from "./types";

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

  public static fromProvider(provider: JsonRpcProvider) {
    return new KioskReadClient(new ReadClient(provider));
  }

  public static fromRpcUrl(url: string) {
    return new KioskReadClient(ReadClient.fromRpcUrl(url));
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
    const ownerTokenType = `${p.packageObjectId || this.package}::${
      p.moduleName || this.module
    }::OwnerToken`;
    const objs = (await this.client.getObjects(user, {
      showType: true,
      showContent: true
    }, {
      Package: this.package
    }));
    return objs
      .filter((o) => o.data.type === ownerTokenType)
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
    if(ownerTokens.length > 0) {
      return this.fetchKiosk(ownerTokens[0].kiosk);
    }
    return undefined;
  }

  public async getWalletKioskId(user: SuiAddress, p: Partial<GlobalParams> = {}) {
    const ownerTokens = await this.fetchOwnerTokens(user, p);
    if(ownerTokens.length > 0) {
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
      item.name.type === "0x2::kiosk::Item"
    ).map((item) => ({kioskId, nft: item.name.value.id}));
  }

  /*
  Returns all the nfts that are contained in every kiosk connected to a specific address
  */
  public async getAllNftKioskAssociations(user: SuiAddress) {
    const kiosks = await this.getWalletKiosks(user);
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
