import { TransactionBlock } from "@mysten/sui.js";
import { 
    TransactionBlockArgument, 
    txObj as txCommon,
    TransactionResult  
} from "../../transaction";
import { DEFAULT_SUI_PACKAGE_ID } from "../consts";
import { GlobalParams } from "../types";
import { ObjectReferenceProps } from "./types";
import { wrapToObject } from "../utils";

function txObj(
  fun: string,
  p: GlobalParams,
  args: (
    tx: TransactionBlock
  ) => (TransactionBlockArgument | TransactionResult)[],
  tArgs: string[]
): [TransactionBlock, TransactionResult] {
  // eslint-disable-next-line no-undef
  if (!p.moduleName) throw new Error("Module name required");
  return txCommon(
    {
      packageObjectId: p.packageObjectId ?? DEFAULT_SUI_PACKAGE_ID,
      moduleName: p.moduleName,
      fun,
      transaction: p.transaction,
    },
    args,
    tArgs
  );
}


export const publicShareObject = (params: ObjectReferenceProps) => {
    return txObj(
        "public_share_object",
        {...params, moduleName: "transfer"},
        (tx) => [
            wrapToObject(tx, params.value)
        ],
        [params.type]
    );
}


export const getId = (params: ObjectReferenceProps) => {
    return txObj(
        "id",
        {...params, moduleName: "object"},
        (tx) => [
            wrapToObject(tx, params.value)
        ],
        [params.type]
    );
}
