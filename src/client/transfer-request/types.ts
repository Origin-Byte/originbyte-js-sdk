import { TransactionResult } from "../../transaction";
import { FTParam, GlobalParams } from "../types";

export interface ConfirmParams extends GlobalParams, FTParam {
    transferRequest: TransactionResult | string,
    nftProtocolContractId: string,
    requestContractId: string,
    transferRequestType: string; 
    policyId: string;
    bpsRoyaltyStrategy: string;
    allowListId: string
}