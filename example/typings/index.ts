declare module 'bip39-light' {
  export function entropyToMnemonic(
    entropy: Buffer | string,
    wordlist?: string[]
  ): string;
  export function generateMnemonic(
    strength?: number,
    rng?: (size: number) => Buffer,
    wordlist?: string[]
  ): string;
  export function mnemonicToSeed(mnemonic: string, password?: string): Buffer;
  export function validateMnemonic(mnemonic: string): boolean;
}
