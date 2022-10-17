import {
  Ed25519Keypair, Ed25519KeypairData, JsonRpcProvider, RawSigner,
} from '@mysten/sui.js';
import * as bip39 from '@scure/bip39';
import nacl = require('tweetnacl');
import { NftClient } from '../src';

export const mnemonic = 'muffin tuition fit fish average true slender tower salmon artist song biology';

export const PACKAGE_OBJECT_ID = '0x6b293ee296cbbfa75248fdfa883150141048817d'; // Change to your deployed contract
export const COLLECTION_ID = '0x46eeb7b0f62a6b293385f0179672804e13d4b1fc'; // Change to your deployed contract
export const LAUNCHPAD_ID = '0x79abefc953a9b045471f7b609ab3b8cb36f375ca'; // Change to your deployed contract
export const AUTHORITY_ID = '0xd7f0327432ecc75a37b684acd1a0bc3cd99e2c83'; // Change to your deployed contract

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
