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
export const PACKAGE_OBJECT_ID = '0x184582a006db60d5b16813079f19d52667e38a41'; // Change to your deployed contract
export const COLLECTION_ID = '0x634766b330497078b6b8b456e118d27b17c03252'; // Change to your deployed contract
export const MINT_CAP_ID = '0x0dc4b4e1f9c1cf800ffddc0ebbcd4c314a137a74'; // Change to your deployed contract
// Step 1 - create Flat fee
export const FEE_OBJECT_ID = '0x0ba2a79612ca87e59fea7ba61d7c7fb3e7e68910'; // Change to your deployed contract
// Step 2 - Init launchpad
export const LAUNCHPAD_ID = '0x50f45622479a13afb32beabca58772ea18a6e2ba'; // Change to your deployed contract
// Step 3 - Init LP Slot
export const LAUNCHPAD_SLOT_ID = '0x9577a7bcf6970f1b7632e7ab0cadbdd0c9a066be'; // Change to your deployed contract
// Step 4 - Create Market
export const MARKET_ID = '0xe2475ddb43781772807193effa75713ebcf76a53'; // Change to your deployed contract

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
