import { Connection, Ed25519Keypair, JsonRpcProvider, RawSigner } from "@mysten/sui.js";
import { NftClient } from "../src";

// export const mnemonic = 'muffin tuition fit fish average true slender tower salmon artist song biology';
export const mnemonic =
  "mesh unable bounce brain hybrid decline convince letter smooth skull banana devote dragon physical cream city invest yellow injury duck moon purpose clean bid";

/**
 * Created Objects:
  - ID:  , Owner: Account Address ( 0xddcdd8e07b59852f58ba8db8daff1b585d2fca23 )
  - ID:  , Owner: Immutable
  - ID:  , Owner: Shared
  - ID:  , Owner: Shared
 */
// Step 0 - Publish
export const PACKAGE_OBJECT_ID = "0x3913738ab2041542ccc261f2041fe1c0b13e4541"; // Change to your deployed contract
export const COLLECTION_ID = "0x91a794209e133711968dbc644021992381bd622f"; // Change to your deployed contract
export const MINT_CAP_ID = "0xab8e0d450a555a166018c875f783a067ab8f64d9"; // Change to your deployed contract
// Step 1 - create Flat fee
export const FEE_OBJECT_ID = "0x6f9206693dfd97d6b60b9ba2a74de081ebd0805f"; // Change to your deployed contract
// Step 2 - Init marketplace
export const MARKETPLACE_ID = "0x090d95aa8807b6b03d251cec2a712d1cc72a4568"; // Change to your deployed contract
// Step 3 - Init Listing
export const LISTING_ID = "0xe517e4bb4bdde43cac0791df4f737f65d3c40db8"; // Change to your deployed contract
// Step 4 - Create Warehouse
export const WAREHOUSE_ID = "0xa3f7cfc3124b7e65de6a0f9444b5299f2691f0ab"; // Change to your deployed contract
// Step 5 - Add inventory to listing
export const INVENTORY_ID = "0x7ce6951e79e21f156b031204f6e871195d1d539a"; // Change to your deployed contract
// Step 6 - Create Market
export const VENUE_ID = "0x58ec0c2f48efaedeed4d62feb2f9adffab701521"; // Change to your deployed contract

export function normalizeMnemonics(mnemonics: string): string {
  return mnemonics
    .trim()
    .split(/\s+/)
    .map((part) => part.toLowerCase())
    .join(" ");
}

export const keypair = Ed25519Keypair.deriveKeypair(mnemonic);

export const provider = new JsonRpcProvider(new Connection({ fullnode: "https://fullnode.devnet.sui.io"} ));
export const signer = new RawSigner(keypair, provider);
export const client = new NftClient(provider);
