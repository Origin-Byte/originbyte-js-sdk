
import { Ed25519Keypair, JsonRpcProvider } from "@mysten/sui.js";
import { GlobalParams } from "../types";
import { FullClient } from "../FullClient";
import { getId, publicShareObject } from "./txBuilder";
import { SuiContractReadClient } from "./SuiContractReadClient";

export class SuiContractFullClient extends SuiContractReadClient {
    // eslint-disable-next-line no-useless-constructor
    constructor(
        public client: FullClient,
        public opts: Partial<GlobalParams>
    // eslint-disable-next-line no-empty-function
    ) {
        super(client, opts);
    }

    public static fromKeypair(
        keypair: Ed25519Keypair,
        provider?: JsonRpcProvider,
        opts?: Partial<GlobalParams>
    ) {
        return new SuiContractFullClient(
            FullClient.fromKeypair(keypair, provider),
            opts
        );
    }

    static publicShareObject = publicShareObject;

    static getId = getId;

}