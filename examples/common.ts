import { Ed25519Keypair, JsonRpcProvider, RawSigner } from '@mysten/sui.js';
import * as bip39 from 'bip39-light';
import { NftClient } from '../src';

export const mnemonic = 'finger wonder priority theme vibrant indoor cause man rib urban wine betray';

export const PACKAGE_OBJECT_ID = '0x5927d212da88a4124681751ee9fb803781e72724'; // Change to your deployed contract

export const seed = bip39.mnemonicToSeed(mnemonic);

export const keypair = Ed25519Keypair.fromSeed(new Uint8Array(seed.toJSON().data.slice(0, 32)));

export const provider = new JsonRpcProvider('https://gateway.devnet.sui.io');
export const signer = new RawSigner(keypair, provider);
export const client = new NftClient(provider);
