import { client, LISTING_ID } from "./common";

const fetchNft = async () => {
  const nfts = await client.getNftsById({ objectIds: ["0xf5af60918ad089e551d0c005699c970498ce80b8"] });
  console.log("nfts", JSON.stringify(nfts, null, 2));

};

fetchNft();
