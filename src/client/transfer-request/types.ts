import { TransactionResult } from "../../transaction";
import { FTParam, GlobalParams, TransactionParams } from "../types";

export interface ConfirmParams extends GlobalParams, FTParam {
  transferRequest: TransactionResult | string,
  nftProtocolContractId: string,
  requestContractId: string,
  transferRequestType: string;
  policyId: string;
  bpsRoyaltyStrategy: string;
  allowListId: string
}

export type BuildInserCollectionToAllowListParams = TransactionParams & {
  allowlistPackageId: string;
  allowlist: string | TransactionResult;
  publisher: string;
  nftType: string;
}
