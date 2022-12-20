import { Ed25519Keypair, JsonRpcProvider, RawSigner } from "@mysten/sui.js";
import { NftClient } from "../src";

export const mnemonic =
  "muffin tuition fit fish average true slender tower salmon artist song biology";

export const PACKAGE_OBJECT_ID = "0xfb83dcc0f1ee1e5fd120afafbcb299fa970b6f65"; // Change to your deployed contract
export const COLLECTION_ID = "0x6970f0cbafc83ea475853855e85ff4d58f7b4f0c"; // Change to your deployed contract
export const LAUNCHPAD_ID = "0xc3ffd86a66fc945df9be6c48ba13b7f0cb278e45"; // Change to your deployed contract
export const AUTHORITY_ID = "0xccf31da9c80d1d441f8836205185d330ac444e4b"; // Change to your deployed contract

export function normalizeMnemonics(mnemonics: string): string {
  return mnemonics
    .trim()
    .split(/\s+/)
    .map((part) => part.toLowerCase())
    .join(" ");
}

export const keypair = Ed25519Keypair.deriveKeypair(mnemonic);

export const provider = new JsonRpcProvider("https://fullnode.devnet.sui.io");
export const signer = new RawSigner(keypair, provider);
export const client = new NftClient(provider);
