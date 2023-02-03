import { client, LISTING_ID, VENUE_ID } from "./common";

const fetchNft = async () => {
  const nfts = await client.getVenuesByParams({
    objectIds: [VENUE_ID],
  });
  console.log("venues", JSON.stringify(nfts, null, 2));
};

fetchNft();
