import {
  Connection,
  Ed25519Keypair,
  JsonRpcProvider,
  RawSigner,
} from "@mysten/sui.js";
import { NftClient, OrderbookFullClient, SafeFullClient } from "../src";

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

export const PACKAGE_OBJECT_ID = "0x52f6dee1b2a9b63d448e1e3956199a1625c63a3c"; // Change to your deployed contract
export const COLLECTION_ID = "0x80b392f50d194f6bd20da7b12b250a66eb539be"; // Change to your deployed contract
export const COLLECTION_ID_NAME = `${COLLECTION_ID}::suim::SUIM`;
export const COLLECTION_TYPE = `${PACKAGE_OBJECT_ID}::collection::Collection<${COLLECTION_ID_NAME}>`;
export const NFT_TYPE = `${PACKAGE_OBJECT_ID}::nft::Nft<${COLLECTION_ID_NAME}>`;

export const MINT_CAP_ID = "0x2ac4bb34ae39625385d0d0355f5ff82b53df1db1"; // Change to your deployed contract
// Step 1 - create Flat fee
export const FEE_OBJECT_ID = "0x2a78356fdb1d91dca38b2ab47082aca02bfd4efb"; // Change to your deployed contract
// Step 2 - Init marketplace
export const MARKETPLACE_ID = "0x717aae68dfc03479818c2c550832c6d2668fe87d"; // Change to your deployed contract
// Step 3 - Init Listing
export const LISTING_ID = "0xd73d1e1f01be135a22777e77326e032892c660fe"; // Change to your deployed contract
// Step 4 - Create Warehouse
export const WAREHOUSE_ID = "0xa3f7cfc3124b7e65de6a0f9444b5299f2691f0ab"; // Change to your deployed contract
// Step 5 - Add inventory to listing
export const INVENTORY_ID = "0x940bf37390b0b5a7ce10d0b433e39faddae3d136"; // Change to your deployed contract
// Step 6 - Create Market
export const VENUE_ID = "0x58ec0c2f48efaedeed4d62feb2f9adffab701521"; // Change to your deployed contract
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

export const keypair = Ed25519Keypair.deriveKeypair(mnemonic);

export const provider = new JsonRpcProvider(
  // new Connection({ fullnode: "https://fullnode.devnet.sui.io" })
  new Connection({ fullnode: "https://explorer-rpc.devnet.sui.io/" })
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
