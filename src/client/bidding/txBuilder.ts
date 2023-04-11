import { TransactionBlock } from "@mysten/sui.js";
import { TransactionBlockArgument, TransactionResult, txObj as txCommon } from "../../transaction";
import { GlobalParams } from "../types";
import { DEFAULT_BIDDING_MODULE, DEFAULT_PACKAGE_ID } from "../consts";
import { CreateBidInput } from "./types";

const txObj = (
  fun: string,
  p: GlobalParams,
  args: (
    tx: TransactionBlock
  ) => (TransactionBlockArgument | TransactionResult)[],
  tArgs: string[]
): [TransactionBlock, TransactionResult] => {
  return txCommon(
    {
      packageObjectId: p.packageObjectId ?? DEFAULT_PACKAGE_ID,
      moduleName: p.moduleName ?? DEFAULT_BIDDING_MODULE,
      fun,
      transaction: p.transaction,
    },
    args,
    tArgs
  );
}


export const createBidTx = (p: CreateBidInput & GlobalParams) => {
    return txObj(
        "create_bid",
        p,
        (tx) => [
            tx.pure(p.buyersKiosk),
            tx.pure(p.nft),
            tx.pure(p.price),
            tx.object(p.wallet)
        ],
        []
    );
};