import { Ed25519Keypair, JsonRpcProvider } from "@mysten/sui.js";
import { OrderbookFullClient, SafeFullClient } from "../src";

export const TESTRACT_ADDRESS = process.env.TESTRACT_ADDRESS;
export const TESTRACT_OTW_TYPE = `${TESTRACT_ADDRESS}::testract::TESTRACT`;
export const TESTRACT_C_TYPE = TESTRACT_OTW_TYPE;
export const NFT_GENERIC_TYPE = `${TESTRACT_ADDRESS}::testract::CapyNft`;
export const NFT_PROTOCOL_ADDRESS = process.env.NFT_PROTOCOL_ADDRESS;
export const NFT_TYPE = `${NFT_PROTOCOL_ADDRESS}::nft::Nft<${TESTRACT_C_TYPE}>`;

const provider = new JsonRpcProvider("LOCAL");
// suiaddr: ddcdd8e07b59852f58ba8db8daff1b585d2fca23
// also determines addr in test.sh
export const keypair = new Ed25519Keypair({
  publicKey: Uint8Array.from([
    123, 49, 136, 138, 93, 52, 142, 26, 32, 156, 52, 154, 223, 80, 191, 2, 136,
    183, 246, 194, 17, 192, 124, 120, 97, 137, 189, 25, 225, 196, 206, 252,
  ]),
  secretKey: Uint8Array.from([
    247, 8, 180, 26, 178, 76, 142, 156, 80, 194, 241, 66, 143, 182, 235, 102,
    66, 242, 47, 157, 43, 116, 165, 212, 124, 189, 163, 59, 11, 212, 187, 138,
    123, 49, 136, 138, 93, 52, 142, 26, 32, 156, 52, 154, 223, 80, 191, 2, 136,
    183, 246, 194, 17, 192, 124, 120, 97, 137, 189, 25, 225, 196, 206, 252,
  ]),
});
export const user = keypair.getPublicKey().toSuiAddress();
export const safeClient = SafeFullClient.fromKeypair(keypair, provider, {
  packageObjectId: NFT_PROTOCOL_ADDRESS,
});
export const orderbookClient = OrderbookFullClient.fromKeypair(
  keypair,
  provider,
  {
    packageObjectId: NFT_PROTOCOL_ADDRESS,
  }
);

export async function getGas() {
  const coins = await provider.getCoinBalancesOwnedByAddress(user);

  if (coins.length === 0) {
    throw new Error(`No gas object for user '${user}'`);
  }
  const coin = coins[0].details;
  if (typeof coin !== "object" || !("data" in coin)) {
    throw new Error(`Unexpected coin type: ${JSON.stringify(coin)}`);
  }

  return coin.reference.objectId;
}

export async function fetchNfts() {
  const objs = await safeClient.client.getObjects(user);
  return objs.filter((o) => o.type === NFT_TYPE).map((o) => o.objectId);
}

export async function fetchGenericNfts() {
  const objs = await safeClient.client.getObjects(user);
  const nfts = objs
    .filter((o) => o.type === NFT_GENERIC_TYPE)
    .map((o) => o.objectId);

  return nfts;
}
