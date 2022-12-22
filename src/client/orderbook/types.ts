import { GlobalParams } from "../types";

export interface CreateOrderbookParams extends GlobalParams {
  collection: string;
  ft: string;
}
