import { MoveCallTransaction } from "@mysten/sui.js";
import { NftClient } from "../src";
import { MINT_CAP_ID, PACKAGE_OBJECT_ID, signer, WAREHOUSE_ID } from "./common";

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
    console.log("Mint...", Date.now(), tx.arguments[0], i);
    // eslint-disable-next-line no-await-in-loop
    const result = await signer.executeMoveCall(tx);
    console.log("result", tx.arguments[0], "EffectsCert" in result);
  }
  //   const createMarketResult = await signer.executeMoveCall(transaction);
  // console.log('createMarketResult', JSON.stringify(createMarketResult));
};

export const mintNFt = async () => {
  const txs: MoveCallTransaction[] = [];
  for (let i = 1; i <= 950; i += 1) {
    txs.push(
      NftClient.buildMintNft({
        name: "Game Over",
        description: "Try Next Time",
        mintCap: MINT_CAP_ID,
        packageObjectId: PACKAGE_OBJECT_ID,
        warehouseId: WAREHOUSE_ID,
        moduleName: "suimarines",
        url: "ipfs://QmcUZmoDWyBB7Cra15XpSpcq628E5T3qvedB5NcbVm9yKM",
        attributes: {
          Status: "Loss",
        },
      })
    );
  }
  for (let i = 1; i <= 50; i += 1) {
    txs.push(
      NftClient.buildMintNft({
        name: `Golden Ticket #${i}`,
        description: "You have been selected",
        mintCap: MINT_CAP_ID,
        packageObjectId: PACKAGE_OBJECT_ID,
        warehouseId: WAREHOUSE_ID,
        moduleName: "suimarines",
        url: "ipfs://QmWD14oS1P91mr4vSzqMXmZJP5jp8BbPtmJkdYpBD9eBdJ",
        attributes: {
          Status: "Win",
        },
      })
    );
  }
  const chunks = splitBy(
    txs.sort((a, b) => 0.5 - Math.random()),
    1000
  );
  await Promise.all(chunks.map((chunk) => mintChunk(chunk)));
  //   const createMarketResult = await signer.executeMoveCall(transaction);
  // console.log('createMarketResult', JSON.stringify(createMarketResult));
};

mintNFt();
