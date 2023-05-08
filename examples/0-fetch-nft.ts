import { CollectionParser } from "../src";
import { client, provider } from "./common";

const fetchNft = async () => {
  const collection = await client.getInventoryById({
    inventoryId:"0x6e5d999c7224e86c3ace86813277c2c9aca462c98e1d91d118c62c4dece70a9c",
  });

  console.log("collection", collection);
};

fetchNft();
