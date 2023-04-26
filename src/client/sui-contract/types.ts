import { ObjectId } from "@mysten/sui.js";
import { GlobalParams } from "../types";
import { TransactionResult } from "../../transaction";

export interface ObjectReferenceProps extends GlobalParams {
    value: ObjectId | TransactionResult,
    type: string
}