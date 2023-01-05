import { LaunchpadSlotParser } from "../src";
import { client, provider } from "./common";

const fetchNft = async () => {
  // const nfts = await client.getNftsById({ objectIds: ['0xa57ba417f0227407d6eb247d670f129bf1aec6b8'] });
  // console.log('nfts', JSON.stringify(nfts, null, 2));
  const c = await client.fetchAndParseObjectsById(
    ["0x9577a7bcf6970f1b7632e7ab0cadbdd0c9a066be"],
    LaunchpadSlotParser
  );
  console.log("C", JSON.stringify(c));
};

fetchNft();
