import { client, LISTING_ID } from "./common";

const fetchNft = async () => {
  const nfts = await client.getNftsById({
    objectIds: ["0xcd7ff5ca80768aba14ceea48285e350c0ce224e4"],
  });
  console.log("nfts", JSON.stringify(nfts, null, 2));
};

fetchNft();
