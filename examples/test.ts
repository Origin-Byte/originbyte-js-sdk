import { Ed25519Keypair, JsonRpcProvider, RawSigner } from "@mysten/sui.js";

const mnemonic = "celery access afford success prize fish huge vacuum shiver orient wine knock"


export const keypair = Ed25519Keypair.deriveKeypair(mnemonic);


console.log("keypair.getPublicKey().toSuiAddress()", keypair.getPublicKey().toSuiAddress())
