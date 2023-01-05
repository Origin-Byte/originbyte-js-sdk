// we want all tests ran sequentially
import safeSuite from "./safe";
import orderbookSuite from "./orderbook";

safeSuite();
orderbookSuite();
