import { TransactionBlock } from "@mysten/sui.js";
import { TransactionBlockArgument, TransactionResult , txObj as txCommon } from "../../transaction";
import { GlobalParams } from "../types";
import { DEFAULT_KIOSK_MODULE, DEFAULT_PACKAGE_ID } from "../consts";

function txObj(
  fun: string,
  p: GlobalParams,
  args: (
    tx: TransactionBlock
  ) => (TransactionBlockArgument | TransactionResult)[],
  tArgs: string[]
): [TransactionBlock, TransactionResult] {
  // eslint-disable-next-line no-undef
  return txCommon(
    {
      packageObjectId: p.packageObjectId ?? DEFAULT_PACKAGE_ID,
      moduleName: p.moduleName ?? DEFAULT_KIOSK_MODULE,
      fun,
      transaction: p.transaction,
    },
    args,
    tArgs
  );
}

export const createKioskTx = (params: GlobalParams): [TransactionBlock, TransactionResult] => {
    return txObj(
      "create_for_sender",
      params,
      () => [], []);
}