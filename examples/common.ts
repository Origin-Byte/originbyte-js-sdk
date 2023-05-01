import {
  Connection,
  Ed25519Keypair,
  JsonRpcProvider,
  RawSigner,
  SUI_TYPE_ARG,
} from "@mysten/sui.js";
import {
  BiddingContractClient,
  KioskFullClient,
  NftClient,
  OrderbookFullClient,
  SafeFullClient,
} from "../src";

// export const mnemonic = 'muffin tuition fit fish average true slender tower salmon artist song biology';
export const mnemonic =
  "elder okay depart innocent soldier tennis lumber eternal permit bunker urge brother";

/**
 * Created Objects:
  - ID:  , Owner: Account Address ( 0xddcdd8e07b59852f58ba8db8daff1b585d2fca23 )
  - ID:  , Owner: Immutable
  - ID:  , Owner: Shared
  - ID:  , Owner: Shared
 */
// Step 0 - Publish

export const PACKAGE_OBJECT_ID =
  "0xd624568412019443dbea9c4e97a6c474cececa7e9daef307457cb34dd04eee0d"; // Change to your deployed contract
export const COLLECTION_ID =
  "0xc64714be5cb0c9c9ab6c349964b18eb11b9739155dd1dfd9af0abe2d71eebb86"; // Change to your deployed contract
export const COLLECTION_ID_NAME = `${COLLECTION_ID}::clutchynfts::ClutchyNft`;
export const COLLECTION_TYPE = `${PACKAGE_OBJECT_ID}::collection::Collection<${COLLECTION_ID_NAME}>`;
export const NFT_TYPE = `${PACKAGE_OBJECT_ID}::nft::Nft<${COLLECTION_ID_NAME}>`;

export const MINT_CAP_ID = "0x2ac4bb34ae39625385d0d0355f5ff82b53df1db1"; // Change to your deployed contract
// Step 1 - create Flat fee
export const FEE_OBJECT_ID = "0x2a78356fdb1d91dca38b2ab47082aca02bfd4efb"; // Change to your deployed contract
// Step 2 - Init marketplace
export const MARKETPLACE_ID = "0x717aae68dfc03479818c2c550832c6d2668fe87d"; // Change to your deployed contract
// Step 3 - Init Listing
export const LISTING_ID =
  "0x2ce87cf327c2f7da2619eb98ff5ddc531c888751789d5b4a62931838e5c8b677"; // Change to your deployed contract
// Step 4 - Create Warehouse
export const WAREHOUSE_ID = "0xa3f7cfc3124b7e65de6a0f9444b5299f2691f0ab"; // Change to your deployed contract
// Step 5 - Add inventory to listing
export const INVENTORY_ID = "0x940bf37390b0b5a7ce10d0b433e39faddae3d136"; // Change to your deployed contract
// Step 6 - Create Market
export const VENUE_ID =
  "0x52c63cb8018fecbc2c3ce8806757d79f27569001f182c3eabfa1c59e4abbcd05"; // Change to your deployed contract
// Step 7 - Create Orderbook
export const ORDERBOOK_ID =
  "0x687dd7bcd3112180e1a2f2f9e980d72764cd1b6214cc52ae99ef548d1a1346b7"; // Change to your deployed contract
// Step 8 - Create AllowList
export const ALLOW_LIST_ID =
  "0x641dcb7bf80a537e46e29e27c637f639ba8f644d5daf396e2b212b9bbe6c0383"; // Change to your deployed contract

export const TRANSFER_REQUEST_POLICY_ID =
  "0x82fc231d6aa2488a4420099841476e658ef1ce39aae557efca5fddc7da156929";

export const TRANSFER_REQUEST_POLICY_TYPE = `${TRANSFER_REQUEST_POLICY_ID}::clutchynfts::ClutchyNft`;

export const CONTRACT_BPS_ROYALTY_STRATEGY_ID =
  "0x721b29839f5c93329afc040316128272679363774440f3f8d596079d62446e24";

export const KIOSK_ID =
  "0xb880efb88af9174c16cf561a07db6aebbca74ace27916761c374f711abb42a76";

export const ORDERBOOK_PACKAGE_ID =
  "0xd34b56feab8ec4e31e32b30564e1d6b11eb32f2985c3fbb85b5be715df006536";

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
      throw new Error(
        `Invalid hex value at position ${i}: ${hexStr.slice(i, i + 2)}`
      );
    }

    byteValues.push(byte);
  }

  return new Uint8Array(byteValues);
}

// eslint-disable-next-line max-len
export const keypair = process.env.WALLET_PK
  ? Ed25519Keypair.fromSecretKey(hexStringToUint8Array(process.env.WALLET_PK))
  : Ed25519Keypair.deriveKeypair(mnemonic);

export const provider = new JsonRpcProvider(
  // new Connection({ fullnode: "https://fullnode.testnet.sui.io" })
  // new Connection({ fullnode: "https://testnet.suiet.app" })
  new Connection({ fullnode: "https://clutchy.io/testnet-blockvision-rpc" })
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
export const kioskClient = KioskFullClient.fromKeypair(keypair, provider, {
  packageObjectId: PACKAGE_OBJECT_ID,
});
export const biddingClient = BiddingContractClient.fromKeypair(
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

export async function getGas() {
  const coins = (
    await provider.getCoins({ owner: user, coinType: SUI_TYPE_ARG })
  ).data;
  if (coins.length === 0) {
    throw new Error(`No gas object for user '${user}'`);
  }
  const coin = coins[0];
  if (typeof coin !== "object") {
    throw new Error(`Unexpected coin type: ${JSON.stringify(coin)}`);
  }

  console.debug("debug: ", coin, coins);
  return coin.coinObjectId;
}

export async function getKiosks() {
  const pubkeyAddress = await signer.getAddress();
  const kiosks = await kioskClient.getWalletKiosks(pubkeyAddress, {
    packageObjectId: KIOSK_ID,
  });

  return kiosks;
}
