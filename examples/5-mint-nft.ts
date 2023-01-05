import { MoveCallTransaction } from "@mysten/sui.js";
import { NftClient } from "../src";
import { INVENTORY_ID, MINT_CAP_ID, PACKAGE_OBJECT_ID, signer } from "./common";

export const splitBy = <T>(list: T[], chunkSize: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < list.length; i += chunkSize) {
    result.push(list.slice(i, i + chunkSize));
  }

  return result;
};

// eslint-disable-next-line no-promise-executor-return
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mintChunk = async (txs: MoveCallTransaction[]) => {
  for (let i = 0; i < txs.length; i += 1) {
    const tx = txs[i];
    // eslint-disable-next-line no-await-in-loop
    // await delay(500 + Math.random() * 2000);
    console.log("Mint...", Date.now(), tx.arguments[0]);
    // eslint-disable-next-line no-await-in-loop
    const result = await signer.executeMoveCall(tx);
    console.log("result", tx.arguments[0], "EffectsCert" in result);
  }
  //   const createMarketResult = await signer.executeMoveCall(transaction);
  // console.log('createMarketResult', JSON.stringify(createMarketResult));
};

export const mintNFt = async () => {
  const txs: MoveCallTransaction[] = [];
  for (let i = 0; i < 10000; i += 1) {
    txs.push(
      NftClient.biuldMintNft({
        name: `Test NFT ${i}`,
        description: `Test NFT ${i} Description `,
        mintCap: MINT_CAP_ID,
        packageObjectId: PACKAGE_OBJECT_ID,
        inventoryId: INVENTORY_ID,
        moduleName: "suitraders",
        url: "https://images.ctfassets.net/6kz06gcm2189/27OknKy2oUNvX8rGm1fHXH/1c5dd162685656aae5cbd3a54c27102c/how-to-mint-an-nft.png",
        attributes: {
          rarity: "Common",
          type: "NFT",
        },
      })
    );
  }
  const chunks = splitBy(txs, 10000);
  await Promise.all(chunks.map((chunk) => mintChunk(chunk)));
  //   const createMarketResult = await signer.executeMoveCall(transaction);
  // console.log('createMarketResult', JSON.stringify(createMarketResult));
};

mintNFt();
