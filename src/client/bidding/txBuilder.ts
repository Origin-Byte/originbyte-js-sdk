import { TransactionBlock } from "@mysten/sui.js";
import { TransactionBlockArgument, TransactionResult, txObj as txCommon } from "../../transaction";
import { GlobalParams } from "../types";
import { DEFAULT_BIDDING_MODULE, DEFAULT_PACKAGE_ID } from "../consts";
import { CreateBidInput, CreateBidWithCommissionInput, SellNft, SellNftFromKiosk } from "./types";

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


export const createBidTx = (p: CreateBidInput) => {
    return txObj(
        "create_bid",
        p,
        (tx) => [
            tx.object(p.buyersKiosk),
            tx.object(p.nft),
            tx.pure(String(p.price)),
            tx.object(p.wallet)
        ],
        [p.ft]
    );
};

export const createBidWithCommissionTx = (p: CreateBidWithCommissionInput) => {
    return txObj(
        "create_bid_with_commission",
        p,
        (tx) => [
            tx.object(p.buyersKiosk),
            tx.object(p.nft),
            tx.pure(String(p.price)),
            tx.object(p.beneficiary),
            tx.pure(String(p.commission)),
            tx.object(p.wallet)
        ],
        [p.ft]
    );
};

export const sellNftFromKiosk = (p: SellNftFromKiosk) => {
    return txObj(
        "sell_nft_from_kiosk",
        p,
        (tx) => [
            tx.object(p.bid),
            tx.object(p.sellersKiosk),
            tx.object(p.buyersKiosk),
            tx.object(p.nft)
        ],
        [p.ft]
    );
};

export const sellNft = (p: SellNft) => {
    return txObj(
        "sell_nft",
        p,
        (tx) => [
            tx.object(p.bid),
            tx.object(p.buyersKiosk),
            tx.object(p.nft)
        ],
        [p.ft]
    );
};