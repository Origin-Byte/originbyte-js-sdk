import { client, LISTING_ID, VENUE_ID } from "./common";

const fetchNft = async () => {
  const nfts = await client.getNftsById({
    objectIds: ["0x2ea51de667bc6b700bdd64c0c1362d34e9c30dd8"],
    resolveBags: false,
  });
  console.log("venues", JSON.stringify(nfts, null, 2));
};

fetchNft();
