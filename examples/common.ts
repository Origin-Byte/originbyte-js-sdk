import {
  Ed25519Keypair, Ed25519KeypairData, JsonRpcProvider, RawSigner,
} from '@mysten/sui.js';
import * as bip39 from '@scure/bip39';
import nacl = require('tweetnacl');
import { NftClient } from '../src';

export const mnemonic = 'muffin tuition fit fish average true slender tower salmon artist song biology';

export const PACKAGE_OBJECT_ID = '0xa7cc0f580d3d3949c847050329a85dba26c42537'; // Change to your deployed contract
export const COLLECTION_ID = '0x6ecb45f3d1a68e41ff0e49ac756db85a3ca90320'; // Change to your deployed contract
export const LAUNCHPAD_ID = '0x3a563734fbbccd9a65e9b97bfb775995b11ff09c'; // Change to your deployed contract
export const AUTHORITY_ID = '0xeb064eac1274d31f8472860728c374c9a422788f'; // Change to your deployed contract

export function normalizeMnemonics(mnemonics: string): string {
  return mnemonics
    .trim()
    .split(/\s+/)
    .map((part) => part.toLowerCase())
    .join(' ');
}

export function getKeypairFromMnemonics(mnemonics: string): Ed25519KeypairData {
  const seed = bip39.mnemonicToSeedSync(normalizeMnemonics(mnemonics));
  return nacl.sign.keyPair.fromSeed(
    // keyPair.fromSeed only takes a 32-byte array where `seed` is a 64-byte array
    new Uint8Array(seed.slice(0, 32)),
  );
}

export const keypair = Ed25519Keypair.deriveKeypair(mnemonic);

export const provider = new JsonRpcProvider('https://gateway.devnet.sui.io');
export const signer = new RawSigner(keypair, provider);
export const client = new NftClient(provider);
