import { Ed25519Keypair, JsonRpcProvider } from "@mysten/sui.js";
import { SafeFullClient } from "../src/index";

const NFT_PROTOCOL_ADDRESS = process.env.NFT_PROTOCOL_ADDRESS;
const TESTRACT_ADDRESS = process.env.TESTRACT_ADDRESS;
const TESTRACT_TYPE = `${TESTRACT_ADDRESS}::testract::TESTRACT`;

// base64: 9Cc3IMAhroBmj32QTZ7LhjNL2vOhKmcnGYRHiCyTJLk=
// suiaddr: 2d1770323750638a27e8a2b4ad4fe54ec2b7edf0
const mnemonic =
  "muffin tuition fit fish average true slender tower salmon artist song biology";
const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
const user = keypair.getPublicKey().toSuiAddress();
const safeClient = SafeFullClient.fromKeypair(
  keypair,
  new JsonRpcProvider("LOCAL"),
  {
    packageObjectId: NFT_PROTOCOL_ADDRESS,
  }
);

test("create safe", async () => {
  const { safe, ownerCap, effects } = await safeClient.createSafeForSender();

  expect(effects.created?.length).toBe(2);
  if (
    typeof effects.created![0].owner === "object" &&
    "Shared" in effects.created![0].owner
  ) {
    expect(effects.created![0].reference.objectId).toBe(safe);
    expect(effects.created![1].reference.objectId).toBe(ownerCap);
  } else {
    expect(effects.created![0].reference.objectId).toBe(ownerCap);
    expect(effects.created![1].reference.objectId).toBe(safe);
  }

  const ownerCaps = await safeClient.fetchOwnerCaps(user);
  expect(ownerCaps.length).toBe(1);
  expect(ownerCaps[0]).toBe(ownerCap);

  expect(await safeClient.fetchOwnerCapSafeId(ownerCap)).toBe(safe);

  const state = await safeClient.fetchSafeByOwnerCap(ownerCap);
  expect(state.id).toBe(safe);
});

test("restrict and enable deposits", async () => {
  const { safe, ownerCap } = await safeClient.createSafeForSender();
  const stateOne = await safeClient.fetchSafe(safe);
  expect(stateOne.enableAnyDeposits).toBe(true);

  await safeClient.restrictDeposits({ safe, ownerCap });
  const stateTwo = await safeClient.fetchSafe(safe);
  expect(stateTwo.enableAnyDeposits).toBe(false);

  await safeClient.enableAnyDeposit({ safe, ownerCap });
  const stateThree = await safeClient.fetchSafe(safe);
  expect(stateThree.enableAnyDeposits).toBe(true);
});

test("restrict and enable deposits of specific collection", async () => {
  const { safe, ownerCap } = await safeClient.createSafeForSender();
  const stateOne = await safeClient.fetchSafe(safe);
  expect(stateOne.collectionsWithEnabledDeposits.length).toBe(0);

  await safeClient.enableDepositsOfCollection({
    safe,
    ownerCap,
    collection: TESTRACT_TYPE,
  });
  const stateTwo = await safeClient.fetchSafe(safe);
  expect(stateTwo.collectionsWithEnabledDeposits.length).toBe(1);
  expect(stateTwo.collectionsWithEnabledDeposits[0]).toBe(TESTRACT_TYPE);

  await safeClient.disableDepositsOfCollection({
    safe,
    ownerCap,
    collection: TESTRACT_TYPE,
  });
  const stateThree = await safeClient.fetchSafe(safe);
  expect(stateThree.collectionsWithEnabledDeposits.length).toBe(0);
});

test("deposit NFT", async () => {
  const nfts = await fetchNfts();

  const { safe } = await safeClient.createSafeForSender();
  await safeClient.depositNft({
    safe,
    nft: nfts[0],
    collection: TESTRACT_TYPE,
  });
  await safeClient.depositNft({
    safe,
    nft: nfts[1],
    collection: TESTRACT_TYPE,
  });

  const state = await safeClient.fetchSafe(safe);
  expect(state.nfts.length).toBe(2);
  expect(state.nfts.find((nft) => nft.id === nfts[0])).toStrictEqual({
    id: nfts[0],
    isExclusivelyListed: false,
    transferCapsCount: 0,
  });
  expect(state.nfts.find((nft) => nft.id === nfts[1])).toStrictEqual({
    id: nfts[1],
    isExclusivelyListed: false,
    transferCapsCount: 0,
  });
});

async function fetchNfts() {
  const nftType = `${NFT_PROTOCOL_ADDRESS}::nft::Nft<${TESTRACT_TYPE}>`;

  const objs = await safeClient.client.getObjects(user);
  return objs.filter((o) => o.type === nftType).map((o) => o.objectId);
}
