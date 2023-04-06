import { CollectionParser } from "../src";
import { client, provider } from "./common";

const fetchNft = async () => {
  const collection = await client.getNftsById({
    objectIds: [
      "0xa0ecd09477e0da36b67e3b3718473f146d233b69b348b9d644a79848587178fe",
    ],
    resolveBags: true,
  });

  console.log("collection", collection);
};

fetchNft();
