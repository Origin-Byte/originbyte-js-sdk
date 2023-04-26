import { FixedPriceMarketParser, LimitedFixedPriceMarketParser } from '../../src/client/parsers';

test("Prasers", async () => {
  const LIMITED_FIXED_PRICE_MARKET_TYPE = 'dynamic_field::Field<0x77d2c5030fb9989c27080a1bb52d9239f43c707d919c86a0dbc637fa5070d6e7::venue::Key, 0x77d2c5030fb9989c27080a1bb52d9239f43c707d919c86a0dbc637fa5070d6e7::limited_fixed_price::LimitedFixedPriceMarket<0x2::sui::SUI>>';
  const limitedMarketMatches = LIMITED_FIXED_PRICE_MARKET_TYPE.match(FixedPriceMarketParser.regex);
  expect(limitedMarketMatches).toBeDefined();
  const FIXED_PRICE_MARKET_TYPE = 'dynamic_field::Field<0x77d2c5030fb9989c27080a1bb52d9239f43c707d919c86a0dbc637fa5070d6e7::venue::Key, 0x77d2c5030fb9989c27080a1bb52d9239f43c707d919c86a0dbc637fa5070d6e7::fixed_price::FixedPriceMarket<0x2::sui::SUI>>'
  const fixedPriceMarketMatches = FIXED_PRICE_MARKET_TYPE.match(LimitedFixedPriceMarketParser.regex);
  expect(fixedPriceMarketMatches).toBeDefined();
});
