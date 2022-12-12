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
export const PACKAGE_OBJECT_ID = '0x39a680ecd9993eaea47dbb4cd9cb2e0672886fef'; // Change to your deployed contract
export const COLLECTION_ID = '0xd88247905ada2e7d771d330feab39bec245cc0db'; // Change to your deployed contract
export const MINT_CAP_ID = '0xd1b3ac2d17eacedcc447680febd76ad246ff0a81'; // Change to your deployed contract
// Step 1 - create Flat fee
export const FEE_OBJECT_ID = '0xc17cc1680143685f1cfeaf78bce5da47c3251a95'; // Change to your deployed contract
export const FEE_BOX_OBJECT_ID = '0x0daa7251a9437253fda9d343c4418e0becbdd43b'; // Change to your deployed contract
// Step 2 - Init launchpad
export const LAUNCHPAD_ID = '0x783852e78784a4d35bf1a2328fabb5002f8ed3fd'; // Change to your deployed contract
// Step 3 - Init LP Slot
export const LAUNCHPAD_SLOT_ID = '0xe6257079149d1b30c068b762cc2387e8286f8b07'; // Change to your deployed contract
// Step 4 - Create Market
export const MARKET_ID = '0x7b3caf53e8bbc178fa61ea1dc0294a150e9e0d02'; // Change to your deployed contract

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
