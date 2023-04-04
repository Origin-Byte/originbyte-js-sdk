import { TransactionArgument, TransactionBlock } from "@mysten/sui.js";

export type BuildTxParams = {
  transaction?: TransactionBlock;
  packageObjectId: string;
  moduleName: string;
  fun: string;
};

export type TransactionResult = TransactionArgument & TransactionArgument[];

export type TransactionBlockArgument = {
  kind: "Input";
  index: number;
  type?: "object" | "pure" | undefined;
  value?: any;
};

export function txObj(
  p: BuildTxParams,
  args: (
    tx: TransactionBlock
  ) => (TransactionBlockArgument | TransactionResult)[],
  tArgs: string[]
): [TransactionBlock, TransactionResult] {
  const tx = p.transaction ?? new TransactionBlock();

  const callResult = tx.moveCall({
    target: `${p.packageObjectId}::${p.moduleName}::${p.fun}`,
    typeArguments: tArgs,
    arguments: args(tx),
  });

  return [tx, callResult];
}
