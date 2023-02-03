import { Ed25519Keypair, JsonRpcProvider, RawSigner } from "@mysten/sui.js";
import { NftClient } from "../src";

// export const mnemonic = 'muffin tuition fit fish average true slender tower salmon artist song biology';
export const mnemonic =
  "mesh unable bounce brain hybrid decline convince letter smooth skull banana devote dragon physical cream city invest yellow injury duck moon purpose clean bid";

/**
 * Created Objects:
  - ID:  , Owner: Account Address ( 0x2d1770323750638a27e8a2b4ad4fe54ec2b7edf0 )
  - ID:  , Owner: Immutable
  - ID:  , Owner: Shared
  - ID:  , Owner: Shared
 */
// Step 0 - Publish
export const PACKAGE_OBJECT_ID = "0xc606fe6ad47ea1836da83b023db1d27d0f211eb0"; // Change to your deployed contract
export const COLLECTION_ID = "0x5f518ed2a960d6eedee7e603cdf646775aa3fccb"; // Change to your deployed contract
export const MINT_CAP_ID = "0x0c6bd9c633e19a63056e52fdc23f9d45527cb836"; // Change to your deployed contract
// Step 1 - create Flat fee
export const FEE_OBJECT_ID = "0x17a8c37941c913ff5e44a6cb18ddfaabc1472c77"; // Change to your deployed contract
// Step 2 - Init marketplace
export const MARKETPLACE_ID = "0x818ba76817ec8ff4e3594e56f1dda2447593873e"; // Change to your deployed contract
// Step 3 - Init Listing
export const LISTING_ID = "0x3e7db1c4f96a3b6993f0772c2a4788c287587820"; // Change to your deployed contract
// Step 4 - Create Inventory
export const WAREHOUSE_ID = "0x002face93266ed5ddcff63530be78aa1f4a8c764"; // Change to your deployed contract
// Step 5 - Create Market
export const VENUE_ID = "0x8092725013d0febb721757d165be05b345d2b387"; // Change to your deployed contract

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
