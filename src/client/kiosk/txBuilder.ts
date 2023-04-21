import { TransactionBlock } from "@mysten/sui.js";
import { TransactionBlockArgument, TransactionResult , txObj as txCommon } from "../../transaction";
import { GlobalParams, KioskParam } from "../types";
import { DEFAULT_KIOSK_MODULE, DEFAULT_PACKAGE_ID, DEFAULT_SUI_PACKAGE_ID, DEFAULT_SUI_TRANSFER_MODULE } from "../consts";
import {
  AuthExclusiveTransferProps, 
  AuthTransferProps, 
  DelistNftAsOwnerInputProps, 
  DepositProps, 
  DisableDepositsOfCollectionProps, 
  EnableAnyDepositProps, 
  EnableDepositsOfCollectionProps, 
  RemoveAuthTransferAsOwnerProps, 
  RemoveAuthTransferProps, 
  RestrictDepositsProps, 
  SetPermissionlessToPermissionedProps, 
  TransferBetweenOwnedProps, 
  TransferDelegatedProps, 
  TransferSignedProps, 
  WithDrawNftProps 
} from "./types";
import { wrapToObject } from "../utils";
import { SuiContractFullClient } from "../sui-contract/SuiContractFullClient";


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

export const newKioskTx = (params: GlobalParams): [TransactionBlock, TransactionResult] => {
    return txObj(
      "new",
      params,
      () => [], []);
}

export const shareKioskTx = (params: GlobalParams & KioskParam): [TransactionBlock, TransactionResult] => {
  return SuiContractFullClient.publicShareObject({
    transaction: params.transaction,
    value: params.kiosk,
    type: "0x2::kiosk::Kiosk"
  });
}

export const getObjectIdTx = (params: GlobalParams & KioskParam): [TransactionBlock, TransactionResult] => {
  return SuiContractFullClient.getId({
    transaction: params.transaction,
    value: params.kiosk,
    type: "0x2::kiosk::Kiosk"
  });
}

export const setPermissionLessToPermissioned = (params: SetPermissionlessToPermissionedProps) => {
  throw new Error("Not yet implemented");
  /* return txObj(
    "set_permissionless_to_permissioned", 
    params, 
    (tx) => [
      tx.object(params.kiosk),
      tx.pure(props.user)
    ], 
    []
  ); */
}

/// Always works if the sender is the owner.
/// Fails if permissionless deposits are not enabled for `T`.
/// See `DepositSetting`.
export const depositTx = (params: DepositProps): [TransactionBlock, TransactionResult] => {
    return txObj(
      "deposit",
      params,
      (tx) => [
        wrapToObject(tx, params.kiosk),
        tx.object(params.nft)
      ], [params.nftType]);
}

// === Withdraw from the Kiosk ===

/// Authorizes given entity to take given NFT out.
/// The entity must prove with their `&UID` in `transfer_delegated` or
/// must be the signer in `transfer_signed`.
///
/// Use the `object::id_to_address` to authorize entities which only live
/// on chain.
export const authTransferTx = (params: AuthTransferProps) => {
  return txObj(
    "auth_transfer",
    params,
    (tx) => [
      wrapToObject(tx, params.kiosk),
      tx.object(params.nft),
      tx.pure(params.entity)
    ],
    []
  );
}

/// Authorizes ONLY given entity to take given NFT out.
/// No one else (including the owner) can perform a transfer.
///
/// The entity must prove with their `&UID` in `transfer_delegated`.
///
/// Only the given entity can then delist their listing.
/// This is a dangerous action to be used only with audited contracts
/// because the NFT is locked until given entity agrees to release it.
export const authExclusiveTransferTx = (params: AuthExclusiveTransferProps) => {
  return txObj(
    "auth_exclusive_transfer",
    params,
    (tx) => [
      wrapToObject(tx, params.kiosk),
      tx.object(params.nft),
      tx.object(params.entity)
    ],
    []
  )
}

/// Can be called by an entity that has been authorized by the owner to
/// withdraw given NFT.
///
/// Returns a builder to the calling entity.
/// The entity then populates it with trade information of which fungible
/// tokens were paid.
///
/// The builder then _must_ be transformed into a hot potato `TransferRequest`
/// which is then used by logic that has access to `TransferPolicy`.
///
/// Can only be called on kiosks in the OB ecosystem.
///
/// We adhere to the deposit rules of the target kiosk.
/// If we didn't, it'd be pointless to even have them since a spammer
/// could simply simulate a transfer and select any target.
export const transferDelegatedTx = (params: TransferDelegatedProps) => {
  return txObj(
    "transfer_delegated",
    params,
    (tx) => [
      tx.object(params.source),
      tx.object(params.target),
      tx.object(params.nft),
      tx.object(params.entityId)
    ],
    [
      params.transferType
    ]
  )
}

/// Similar to `transfer_delegated` but instead of proving origin with
/// `&UID` we check that the entity is the signer.
///
/// This will always work if the signer is the owner of the kiosk
export const transferSignedTx = (params: TransferSignedProps) => {
  return txObj(
    "transfer_signed",
    params,
    (tx) => [
      tx.object(params.source),
      tx.object(params.target),
      tx.object(params.nft)
    ],
    [
      params.transferType
    ]
  )
}

/// We allow withdrawing NFTs for some use cases.
/// If an NFT leaves our kiosk ecosystem, we can no longer guarantee
/// royalty enforcement.
/// Therefore, creators might not allow entities which enable withdrawing
/// NFTs to trade their collection.
///
/// You almost certainly want to use `transfer_delegated`.
///
/// Handy for migrations.
export const withdrawNftTx = (params: WithDrawNftProps): [TransactionBlock, TransactionResult] => {
    return txObj(
      "withdraw_nft",
      params,
      (tx) => [
        wrapToObject(tx, params.kiosk),
        tx.object(params.nft),
        tx.pure(params.entityId)
      ], [
        params.nftType
      ]);
}

/// If both kiosks are owned by the same user, then we allow free transfer.
export const transferBetweenOwnedTx = (params: TransferBetweenOwnedProps): [TransactionBlock, TransactionResult] => {
    return txObj(
      "transfer_between_owned",
      params,
      (tx) => [
        tx.object(params.source),
        tx.object(params.target),
        tx.object(params.nft)
      ], [
        params.nftType
      ]);
}

/// Removes _all_ entities from access to the NFT.
/// Cannot be performed if the NFT is exclusively listed.
export const delistNftAsOwnerTx = (params: DelistNftAsOwnerInputProps): [TransactionBlock, TransactionResult] => {
  return txObj(
    "delist_nft_as_owner",
    params,
    (tx) => [
      wrapToObject(tx, params.kiosk)
    ],
    []
  )
}


/// This is the only path to delist an exclusively listed NFT.
export const removeAuthTransferTx = (params: RemoveAuthTransferProps): [TransactionBlock, TransactionResult] => {
  return txObj(
    "remove_auth_transfer",
    params,
    (tx) => [
      wrapToObject(tx, params.kiosk),
      tx.object(params.nft),
      tx.pure(params.entity)
    ],
    []
  )
}


/// Removes a specific NFT from access to the NFT.
/// Cannot be performed if the NFT is exclusively listed.
export const removeAuthTransferAsOwnerTx = (params: RemoveAuthTransferAsOwnerProps): [TransactionBlock, TransactionResult] => {
  return txObj(
    "remove_auth_transfer_as_owner",
    params,
    (tx) => [
      wrapToObject(tx, params.kiosk),
      tx.object(params.nft),
      tx.pure(params.entity)
    ],
    []
  )
}

// === Configure deposit settings ===

/// Only owner or allowlisted collections can deposit.
export const restrictDepositsTx = (params: RestrictDepositsProps): [TransactionBlock, TransactionResult] => {
  return txObj(
    "restrict_deposits",
    params,
    (tx) => [
      wrapToObject(tx, params.kiosk),
    ],
    []
  )
}


/// No restriction on deposits.
export const enableAnyDepositTx = (params: EnableAnyDepositProps): [TransactionBlock, TransactionResult] => {
  return txObj(
    "enable_any_deposit",
    params,
    (tx) => [
      wrapToObject(tx, params.kiosk),
    ],
    []
  )
}


/// The owner can restrict deposits into the `Kiosk` from given
/// collection.
///
/// However, if the flag `DepositSetting::enable_any_deposit` is set to
/// true, then it takes precedence.
export const disableDepositsOfCollectionTx = (params: DisableDepositsOfCollectionProps) => {
  return txObj(
    "disable_deposits_of_collection",
    params,
    (tx) => [
      wrapToObject(tx, params.kiosk),
    ],
    [
      params.collectionType
    ]
  )
}


/// The owner can enable deposits into the `Kiosk` from given
/// collection.
///
/// However, if the flag `Kiosk::enable_any_deposit` is set to
/// true, then it takes precedence anyway.
export const enableDespositsOfCollectionTx = (params: EnableDepositsOfCollectionProps): [TransactionBlock, TransactionResult] => {
  return txObj(
    "enable_deposits_of_collection",
    params,
    (tx) => [
      wrapToObject(tx, params.kiosk),
    ],
    [params.collectionType]
  )
}