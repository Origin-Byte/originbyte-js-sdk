import { Ed25519Keypair, JsonRpcProvider } from "@mysten/sui.js";
import { OrderbookFullClient, SafeFullClient } from "../src";

export const TESTRACT_ADDRESS = process.env.TESTRACT_ADDRESS;
export const TESTRACT_OTW_TYPE = `${TESTRACT_ADDRESS}::testract::TESTRACT`;
export const NFT_GENERIC_TYPE = `${TESTRACT_ADDRESS}::testract::CapyNft`;
export const NFT_PROTOCOL_ADDRESS = process.env.NFT_PROTOCOL_ADDRESS;
export const NFT_TYPE = `${NFT_PROTOCOL_ADDRESS}::nft::Nft<${TESTRACT_OTW_TYPE}>`;

const provider = new JsonRpcProvider("LOCAL");
// base64: 9Cc3IMAhroBmj32QTZ7LhjNL2vOhKmcnGYRHiCyTJLk=
// suiaddr: 2d1770323750638a27e8a2b4ad4fe54ec2b7edf0
// also determines addr in test.sh
export const mnemonic =
  "muffin tuition fit fish average true slender tower salmon artist song biology";
export const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
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
