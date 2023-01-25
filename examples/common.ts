import { Ed25519Keypair, JsonRpcProvider, RawSigner } from "@mysten/sui.js";
import { NftClient } from "../src";

// export const mnemonic = 'muffin tuition fit fish average true slender tower salmon artist song biology';
export const mnemonic =
  "window exercise virtual sunset crawl deliver shiver public wrist breeze shuffle must mandate panther piece comfort obvious link outer emotion collect sauce drift butter";

/**
 * Created Objects:
  - ID:  , Owner: Account Address ( 0x2d1770323750638a27e8a2b4ad4fe54ec2b7edf0 )
  - ID:  , Owner: Immutable
  - ID:  , Owner: Shared
  - ID:  , Owner: Shared
 */
// Step 0 - Publish
export const PACKAGE_OBJECT_ID = "0xe64cb3268f5e24d5242a7614b5dd0f882b50389f"; // Change to your deployed contract
export const COLLECTION_ID = "0x726ee27f9b062b7553ef2131c4ca2b58ecf7368d"; // Change to your deployed contract
export const MINT_CAP_ID = "0xc1eff96e6f69a1e9525a5bf663449171fbf8a7ab"; // Change to your deployed contract
// Step 1 - create Flat fee
export const FEE_OBJECT_ID = "0x0e66bd30bad5240d5b9f76d20ad0146d821d1241"; // Change to your deployed contract
// Step 2 - Init marketplace
export const MARKETPLACE_ID = "0x4f35db43f787d36b2ee50f57997969bd517e22aa"; // Change to your deployed contract
// Step 3 - Init Listing
export const LISTING_ID = "0x7e9153388302b20d128eaebb5c5eac458c0831e7"; // Change to your deployed contract
// Step 4 - Create Inventory
export const INVENTORY_ID = "0x528b9613086fc1e4e223ec63ef4296d5ba0eda47"; // Change to your deployed contract
// Step 5 - Create Market
export const MARKET_ID = "0xecfa62e938a37921ebb39c686cd1b3a7bb114fa8"; // Change to your deployed contract

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
