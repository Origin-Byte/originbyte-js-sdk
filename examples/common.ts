import { Ed25519Keypair, JsonRpcProvider, RawSigner } from "@mysten/sui.js";
import { NftClient } from "../src";

// export const mnemonic = 'muffin tuition fit fish average true slender tower salmon artist song biology';
export const mnemonic = "harvest empty express erase pause bundle clarify box install arena push guard";

/**
 * Created Objects:
  - ID:  , Owner: Account Address ( 0x2d1770323750638a27e8a2b4ad4fe54ec2b7edf0 )
  - ID:  , Owner: Immutable
  - ID:  , Owner: Shared
  - ID:  , Owner: Shared
 */
// Step 0 - Publish
export const PACKAGE_OBJECT_ID = "0xa581a7bab1c2cc9b5439d6634dcf8b345567bfdb"; // Change to your deployed contract
export const COLLECTION_ID = "0xb7aaa80ff9e3419bac417c93f5a782f067d1615c"; // Change to your deployed contract
export const MINT_CAP_ID = "0x9ae9ced1468b7c92fbf2de36db027c3b5419ebee"; // Change to your deployed contract
// Step 1 - create Flat fee
export const FEE_OBJECT_ID = "0x9e373bba8e2f530449bd3a9737dd4111eab03fa0"; // Change to your deployed contract
// Step 2 - Init launchpad
export const LAUNCHPAD_ID = "0x90d284697724e8f53f274321c05070e32bdf0f87"; // Change to your deployed contract
// Step 3 - Init LP Slot
export const LAUNCHPAD_SLOT_ID = "0x683871a2ec40c93260b1e8a9a73d1749c3287dd3"; // Change to your deployed contract
// Step 4 - Create Inventory
export const INVENTORY_ID = "0x902f37eb854c7c8fc9102d3ab01cba26ec190751"; // Change to your deployed contract
// Step 5 - Create Market
export const MARKET_ID = "0xe2475ddb43781772807193effa75713ebcf76a53"; // Change to your deployed contract

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
