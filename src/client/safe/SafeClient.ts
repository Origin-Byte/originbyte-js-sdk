import {
  createSafeForSenderTx,
  restrictDepositsTx,
  enableAnyDepositTx,
  setDepositsOfCollectionTx,
  depositNftTx,
  depositNftPrivilegedTx,
  depositGenericNftTx,
  depositGenericNftPrivilegedTx,
  createTransferCapForSenderTx,
  createExclusiveTransferCapForSenderTx,
} from "./txBuilder";

export class SafeClient {
  static createSafeForSenderTx = createSafeForSenderTx;

  static restrictDepositsTx = restrictDepositsTx;

  static enableAnyDepositTx = enableAnyDepositTx;

  static setDepositsOfCollectionTx = setDepositsOfCollectionTx;

  static depositNftTx = depositNftTx;

  static depositNftPrivilegedTx = depositNftPrivilegedTx;

  static depositGenericNftTx = depositGenericNftTx;

  static depositGenericNftPrivilegedTx = depositGenericNftPrivilegedTx;

  static createTransferCapForSenderTx = createTransferCapForSenderTx;

  static createExclusiveTransferCapForSenderTx =
    createExclusiveTransferCapForSenderTx;
}
