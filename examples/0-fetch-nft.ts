import { CollectionParser } from "../src";
import { client, provider } from "./common";

const fetchNft = async () => {
  const collection = await client.getCollectionsById({
    objectIds: ["0xede9e7dffa0181ca4f3d68d8b2ae0ab20a648df2e00b40881b32887092cdd0a0"]
  })

  console.log("collection", collection);
};

fetchNft();
