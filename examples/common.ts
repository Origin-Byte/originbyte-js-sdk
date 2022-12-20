import {
  Ed25519Keypair, JsonRpcProvider, RawSigner,
} from '@mysten/sui.js';
import { NftClient } from '../src';

// export const mnemonic = 'muffin tuition fit fish average true slender tower salmon artist song biology';
export const mnemonic = 'celery access afford success prize fish huge vacuum shiver orient wine knock';

/**
 * Created Objects:
  - ID:  , Owner: Account Address ( 0x2d1770323750638a27e8a2b4ad4fe54ec2b7edf0 )
  - ID:  , Owner: Immutable
  - ID:  , Owner: Shared
  - ID:  , Owner: Shared
 */
// Step 0 - Publish
export const PACKAGE_OBJECT_ID = '0xe3312475a2333cfec37f70033ded37e209a8485e'; // Change to your deployed contract
export const COLLECTION_ID = '0x56f4152d8ae4b14140eb4e2e1a7ba8b2ca3e7a8a'; // Change to your deployed contract
export const MINT_CAP_ID = '0x832da8adafc613352c6393c3fcc3da3b3cc09358'; // Change to your deployed contract
// Step 1 - create Flat fee
export const FEE_OBJECT_ID = '0x3b8c36a6187b2bda214af6058c3bf1f7551bf319'; // Change to your deployed contract
// Step 2 - Init launchpad
export const LAUNCHPAD_ID = '0x4853d5047cf2b4c651fcb615dde1754c5d0ef363'; // Change to your deployed contract
// Step 3 - Init LP Slot
export const LAUNCHPAD_SLOT_ID = '0xfe8c175ed95eb19996b33671599ffeebb8cf1bac'; // Change to your deployed contract
// Step 4 - Create Market
export const MARKET_ID = '0x301aac82991a41b2c693936f95c334685acec316'; // Change to your deployed contract

export function normalizeMnemonics(mnemonics: string): string {
  return mnemonics
    .trim()
    .split(/\s+/)
    .map((part) => part.toLowerCase())
    .join(' ');
}

export const keypair = Ed25519Keypair.deriveKeypair(mnemonic);

export const provider = new JsonRpcProvider('https://fullnode.devnet.sui.io');
export const signer = new RawSigner(keypair, provider);
export const client = new NftClient(provider);
