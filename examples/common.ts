import {
  Connection,
  Ed25519Keypair,
  JsonRpcProvider,
  RawSigner,
} from "@mysten/sui.js";
import { KioskFullClient, NftClient, OrderbookFullClient, SafeFullClient } from "../src";

// export const mnemonic = 'muffin tuition fit fish average true slender tower salmon artist song biology';
export const mnemonic =
  "strike silk season point pass raven vote hawk hand relief diagram person";

/**
 * Created Objects:
  - ID:  , Owner: Account Address ( 0xddcdd8e07b59852f58ba8db8daff1b585d2fca23 )
  - ID:  , Owner: Immutable
  - ID:  , Owner: Shared
  - ID:  , Owner: Shared
 */
// Step 0 - Publish

export const PACKAGE_OBJECT_ID =
  "0x86ed6bc882fa476f20db8d21256a20cc7c841b9e1a37c356daa5406f92412f3c"; // Change to your deployed contract
export const COLLECTION_ID =
  "0x8be1aceaa7d4ebf1db11382d4ca1c4c8a358fe08771244f85ce62202ec28b68f"; // Change to your deployed contract
export const COLLECTION_ID_NAME = `${COLLECTION_ID}::suitraders::SUITRADERS`;
export const COLLECTION_TYPE = `${PACKAGE_OBJECT_ID}::collection::Collection<${COLLECTION_ID_NAME}>`;
export const NFT_TYPE = `${PACKAGE_OBJECT_ID}::nft::Nft<${COLLECTION_ID_NAME}>`;

export const MINT_CAP_ID = "0x2ac4bb34ae39625385d0d0355f5ff82b53df1db1"; // Change to your deployed contract
// Step 1 - create Flat fee
export const FEE_OBJECT_ID = "0x2a78356fdb1d91dca38b2ab47082aca02bfd4efb"; // Change to your deployed contract
// Step 2 - Init marketplace
export const MARKETPLACE_ID = "0x717aae68dfc03479818c2c550832c6d2668fe87d"; // Change to your deployed contract
// Step 3 - Init Listing
export const LISTING_ID =
  "0x5cceb918d7f98f5536c8727b1165f8130633c13f19d7e1b462245ec9a8a3a856"; // Change to your deployed contract
// Step 4 - Create Warehouse
export const WAREHOUSE_ID = "0xa3f7cfc3124b7e65de6a0f9444b5299f2691f0ab"; // Change to your deployed contract
// Step 5 - Add inventory to listing
export const INVENTORY_ID = "0x940bf37390b0b5a7ce10d0b433e39faddae3d136"; // Change to your deployed contract
// Step 6 - Create Market
export const VENUE_ID =
  "0x52c63cb8018fecbc2c3ce8806757d79f27569001f182c3eabfa1c59e4abbcd05"; // Change to your deployed contract
// Step 7 - Create Orderbook
export const ORDERBOOK_ID = "0x12f05d1dfc8210877ca83ea5b58f2beef992f587"; // Change to your deployed contract
// Step 8 - Create AllowList
export const ALLOW_LIST_ID = "0x20c97662993a9ef4ab3b07dd9ed97be182b0ad40"; // Change to your deployed contract

export function normalizeMnemonics(mnemonics: string): string {
  return mnemonics
    .trim()
    .split(/\s+/)
    .map((part) => part.toLowerCase())
    .join(" ");
}

function hexStringToUint8Array(hexStr: string) {
  if (hexStr.length % 2 !== 0) {
    throw new Error("Invalid hex string length.");
  }

  const byteValues: number[] = [];

  for (let i = 0; i < hexStr.length; i += 2) {
    const byte: number = parseInt(hexStr.slice(i, i + 2), 16);

    if (Number.isNaN(byte)) {
      throw new Error(`Invalid hex value at position ${i}: ${hexStr.slice(i, i + 2)}`);
    }

    byteValues.push(byte);
  }

  return new Uint8Array(byteValues);
}


// eslint-disable-next-line max-len
export const keypair = process.env.WALLET_PK ? Ed25519Keypair.fromSecretKey(hexStringToUint8Array(process.env.WALLET_PK)) : Ed25519Keypair.deriveKeypair(mnemonic);

export const provider = new JsonRpcProvider(
  // new Connection({ fullnode: "https://fullnode.devnet.sui.io" })
  new Connection({ fullnode: "https://testnet.suiet.app" })
);
export const signer = new RawSigner(keypair, provider);
export const client = new NftClient(provider);
export const orderbookClient = OrderbookFullClient.fromKeypair(
  keypair,
  provider,
  {
    packageObjectId: PACKAGE_OBJECT_ID,
  }
);
export const kioskClient = KioskFullClient.fromKeypair(
  keypair,
  provider,
  {
    packageObjectId: PACKAGE_OBJECT_ID,
  }
);
export const safeClient = SafeFullClient.fromKeypair(keypair, provider, {
  packageObjectId: PACKAGE_OBJECT_ID,
});

export const user = keypair.getPublicKey().toSuiAddress();

export const feeCollectorAddress = "0x29c8227d3c77ead5816b243be14dc53f09b59c09";

export async function fetchNfts() {
  const objs = await safeClient.client.getObjects(user);
  // console.log("objs: ", objs)
  return objs
    .filter((o) => o.data?.type === NFT_TYPE)
    .map((o) => o.data?.objectId);
}

export async function getSafeAndOwnerCap() {
  const ownerCaps = await safeClient.fetchOwnerCapsIds(user);
  const safeIdsByOwnerCap = await Promise.all(
    ownerCaps.map(async (ownerCap) => safeClient.fetchOwnerCapSafeId(ownerCap))
  );

  let safe = safeIdsByOwnerCap[0];
  let ownerCap = ownerCaps[0];

  if (safeIdsByOwnerCap.length === 0) {
    const result = await safeClient.createSafeForSender();
    ownerCap = result.ownerCap;
    safe = result.safe;
  }

  // console.log("ownerCap: ", ownerCap, "safe: ", safe)
  return { ownerCap, safe };
}
