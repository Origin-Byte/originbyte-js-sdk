import { ArtNftRpcResponse } from "./types";
import { ArtNftParser } from "./parsers";

export const isArtNft = (obj: any): obj is {data: {fields: ArtNftRpcResponse, type: string}} => {
  return ("data" in obj && "fields" in obj.data && obj.data.type && !!obj.data.type.match(ArtNftParser.regex));
};
