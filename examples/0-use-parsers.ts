import {
  AllowlistParser,
  CollectionParser,
  FixedPriceMarketParser,
  FlatFeeParser,
  InventoryParser,
  LimitedFixedPriceMarketParser,
  ListingParser,
  MarketplaceParser,
  MintCapParser,
  OrderbookParser,
  VenueParser,
} from "../src";
import { client, provider } from "./common";

const useParsers = async () => {
  const [fee] = await client.fetchAndParseObjectsById(
    ["0x0b4220239e180479f118f4694ef8c8c0b91635ae"],
    FlatFeeParser
  );
  console.log("fee.packageObjectId", fee.packageObjectId);
  const [marketplace] = await client.fetchAndParseObjectsById(
    ["0x638a1c1e1dea1ccf6a45b297d2fd3924f3cd78cd"],
    MarketplaceParser
  );
  console.log("marketplace.packageObjectId", marketplace.packageObjectId);

  const [listing] = await client.fetchAndParseObjectsById(
    ["0xf78576498556a856f86bdb513dfd4e57ba0b6eb9"],
    ListingParser
  );
  console.log("listing.packageObjectId", listing.packageObjectId);

  const [orderbook] = await client.fetchAndParseObjectsById(
    ["0x03db742286dbd75d12c6746422e685f1942d9796"],
    OrderbookParser
  );
  console.log("orderbook.packageObjectId", orderbook.packageObjectId);

  const [inventory] = await client.fetchAndParseObjectsById(
    ["0x9418fd7f0906d444262aa081a30c75761a7bd253"],
    InventoryParser
  );
  console.log("inventory.packageObjectId", inventory.packageObjectId);

  const [venue] = await client.fetchAndParseObjectsById(
    ["0xbb0a3aedaee230a2df3e2defb5e1f7f7650618f1"],
    VenueParser
  );
  console.log("venue.packageObjectId", venue.packageObjectId);

  const marketObj = await provider.getObject(
    "0xc22904b27db6a160640bfb81d95319d2cab341ea"
  );
  const [openMarket] = await client.parseObjects(
    [marketObj],
    FixedPriceMarketParser
  );
  const [fixedMarket] = await client.parseObjects(
    [marketObj],
    LimitedFixedPriceMarketParser
  );

  const market = openMarket || fixedMarket;
  console.log("market.packageObjectId", market.packageObjectId);

  const [collection] = await client.fetchAndParseObjectsById(
    ["0xca5e9b706359c0a1f8ef766dd4811c0110c7de2b"],
    CollectionParser
  );
  console.log(
    "collection.packageObjectId",
    collection.packageObjectId,
    collection.nftProtocolPackageObjectId
  );

  const [mintCap] = await client.fetchAndParseObjectsById(
    ["0x273c0cfb47456d8bdeabdeb7b95a2c600a5486ab"],
    MintCapParser
  );

  console.log("mintCap.packageObjectId", mintCap.packageObjectId);

  const [allowList] = await client.fetchAndParseObjectsById(
    ["0x1c7d9438358f09317beb7320cc7f63b4d915489a"],
    AllowlistParser
  );

  console.log("allowList.packageObjectId", allowList.packageObjectId);
};

useParsers();
