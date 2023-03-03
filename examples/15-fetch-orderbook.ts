import { orderbookClient, ORDERBOOK_ID } from "./common";

export const fetchOrderbook = async () => {
  const orderbookState = await orderbookClient.fetchOrderbook(ORDERBOOK_ID);

  console.log("ORDERBOOK_ID: ", ORDERBOOK_ID);
  console.log("orderbookState: ", JSON.stringify(orderbookState));
};

fetchOrderbook();
