import {
  Connection,
  Ed25519Keypair,
  JsonRpcProvider,
  RawSigner,
} from "@mysten/sui.js";
import { NftClient, OrderbookFullClient, SafeFullClient } from "../src";

// export const mnemonic = 'muffin tuition fit fish average true slender tower salmon artist song biology';
export const mnemonic =
  "risk pride purity oxygen donor half spray already voice limb table toe";

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
  "0xfc8ebeab5d39266393b21144ee9a160ef77a2f9eade879defc134b6a8404a532"; // Change to your deployed contract
export const COLLECTION_ID_NAME = `${COLLECTION_ID}::suitraders::Suitrader`;
export const COLLECTION_TYPE = `${PACKAGE_OBJECT_ID}::collection::Collection<${COLLECTION_ID_NAME}>`;
export const NFT_TYPE = `${PACKAGE_OBJECT_ID}::nft::Nft<${COLLECTION_ID_NAME}>`;

export const MINT_CAP_ID = "0xbb1b98c0955602208b69f1522eaa5eb3efc7e507841cd31d225330a0bea2af34"; // Change to your deployed contract
// Step 1 - create Flat fee
export const FEE_OBJECT_ID = "0x2a78356fdb1d91dca38b2ab47082aca02bfd4efb"; // Change to your deployed contract
// Step 2 - Init marketplace
export const MARKETPLACE_ID = "0xe109724b4ef1aa45ddd05aca9a4a7b2f5dcd392791715c606ea97e6bb6a4f665"; // Change to your deployed contract
// Step 3 - Init Listing
export const LISTING_ID =
  "0xbb2809d83eb249b761f09d4b23456702433efbcdef844fa9c1a56aab11c02a4e"; // Change to your deployed contract
// Step 4 - Create Warehouse
export const WAREHOUSE_ID = "0xa3f7cfc3124b7e65de6a0f9444b5299f2691f0ab"; // Change to your deployed contract
// Step 5 - Add inventory to listing
export const INVENTORY_ID = "0x79dc9acad51383d31b0777414f611c697614dd74797f43414720f9d097124774"; // Change to your deployed contract
// Step 6 - Create Market
export const VENUE_ID =
  "0xd3c195dd21a25bec8af0d16a3775ef6e0a9a8137dbb8a560eb473ac961ce1a79"; // Change to your deployed contract
// Step 7 - Create Orderbook
export const ORDERBOOK_ID = "0x0edf2669440bd70c2362b63dfcdc86ba45a685e92c752cfe9bc200d90e15ef22"; // Change to your deployed contract
// Step 8 - Create AllowList
export const ALLOW_LIST_ID = "0x1b9036d1d951562f6f9f5594eab874c40a466552dd4f1ee3558aa556b677c925"; // Change to your deployed contract

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
  // new Connection({ fullnode: "https://explorer-rpc.devnet.sui.io/" })
    // new Connection({ fullnode: "https://clutchy.io/testnet-rpc" })
  new Connection({ fullnode: "https://fullnode.testnet.sui.io" })


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
