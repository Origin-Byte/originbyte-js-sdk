import {
  TESTRACT_TYPE,
  NFT_GENERIC_TYPE,
  safeClient,
  user,
  fetchNfts,
  fetchGenericNfts,
} from "./common";

export default function suite() {
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
    const allNfts = await fetchNfts();
    expect(allNfts.length).toBeGreaterThan(3);
    const nfts = allNfts.slice(0, 3);
    const { safe, ownerCap } = await safeClient.createSafeForSender();

    await safeClient.depositNftPrivileged({
      safe,
      ownerCap,
      nft: nfts[0],
      collection: TESTRACT_TYPE,
    });
    for (const nft of nfts.slice(1)) {
      await safeClient.depositNft({
        safe,
        nft,
        collection: TESTRACT_TYPE,
      });
    }

    const state = await safeClient.fetchSafe(safe);
    expect(state.nfts.length).toBe(nfts.length);
    nfts.forEach((nft) => {
      const needle = state.nfts.find((needle) => needle.id === nft)!;
      expect(needle).toBeTruthy();
      expect(needle.id).toBe(nft);
      expect(needle.isExclusivelyListed).toBe(false);
      expect(needle.transferCapsCount).toBe(0);
      expect(needle.version).toBeTruthy();
    });
  });

  test("deposit generic NFT", async () => {
    const nfts = await fetchGenericNfts();
    expect(nfts.length).toBeGreaterThan(1);
    const { safe, ownerCap } = await safeClient.createSafeForSender();

    await safeClient.depositGenericNftPrivileged({
      safe,
      ownerCap,
      nft: nfts[0],
      collection: NFT_GENERIC_TYPE,
    });
    for (const nft of nfts.slice(1)) {
      await safeClient.depositGenericNft({
        safe,
        nft,
        collection: NFT_GENERIC_TYPE,
      });
    }

    const state = await safeClient.fetchSafe(safe);
    expect(state.nfts.length).toBe(nfts.length);
    nfts.forEach((nft) => {
      const needle = state.nfts.find((needle) => needle.id === nft)!;
      expect(needle).toBeTruthy();
      expect(needle.id).toBe(nft);
      expect(needle.isExclusivelyListed).toBe(false);
      expect(needle.transferCapsCount).toBe(0);
      expect(needle.version).toBeTruthy();
    });
  });

  test("transfer cap operations", async () => {
    const nft = (await fetchNfts())[0];
    expect(nft).not.toBeUndefined();
    const { safe, ownerCap } = await safeClient.createSafeForSender();

    await safeClient.depositNft({
      safe,
      nft,
      collection: TESTRACT_TYPE,
    });

    const { transferCap } = await safeClient.createTransferCapForSender({
      safe,
      nft,
      ownerCap,
    });
    const safeState = await safeClient.fetchSafe(safe);
    expect(safeState.nfts.length).toBe(1);
    expect(safeState.nfts[0].transferCapsCount).toBe(1);
    expect(safeState.nfts[0].isExclusivelyListed).toBe(false);

    const transferCapState = await safeClient.fetchTransferCap(transferCap);
    expect(transferCapState.safe).toBe(safe);
    expect(transferCapState.isExclusivelyListed).toBe(false);
    expect(transferCapState.nft).toBe(nft);
    expect(transferCapState.version).toBe(safeState.nfts[0].version);

    await safeClient.delistNft({ safe, nft, ownerCap });
    const safeStateAfterDelist = await safeClient.fetchSafe(safe);
    expect(safeStateAfterDelist.nfts.length).toBe(1);
    expect(transferCapState.version).not.toBe(
      safeStateAfterDelist.nfts[0].version
    );

    await safeClient.burnTransferCap({ safe, transferCap });
    try {
      await safeClient.fetchTransferCap(transferCap);
      fail("Transfer cap should be burned");
    } catch (error) {
      expect(error.message).toContain("does not exist");
    }
  });

  test("exclusive transfer cap operations", async () => {
    const nft = (await fetchNfts())[0];
    expect(nft).not.toBeUndefined();
    const { safe, ownerCap } = await safeClient.createSafeForSender();

    await safeClient.depositNft({
      safe,
      nft,
      collection: TESTRACT_TYPE,
    });

    const { transferCap } =
      await safeClient.createExclusiveTransferCapForSender({
        safe,
        nft,
        ownerCap,
      });
    const safeState = await safeClient.fetchSafe(safe);
    expect(safeState.nfts.length).toBe(1);
    expect(safeState.nfts[0].transferCapsCount).toBe(1);
    expect(safeState.nfts[0].isExclusivelyListed).toBe(true);

    const transferCapState = await safeClient.fetchTransferCap(transferCap);
    expect(transferCapState.safe).toBe(safe);
    expect(transferCapState.isExclusivelyListed).toBe(true);
    expect(transferCapState.nft).toBe(nft);
    expect(transferCapState.version).toBeTruthy();
  });
}
