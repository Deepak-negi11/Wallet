import { Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import { HDNodeWallet, Wallet } from "ethers";

export type SupportedChain = 'solana' | 'ethereum';

export type SolanaWallet = {
  chain: 'solana';
  mnemonic: string;
  publicKey: string;
  secretKey: string;
  index: number;
  path: string;
};

export type EthereumWallet = {
  chain: 'ethereum';
  mnemonic: string;
  address: string;
  privateKey: string;
  index: number;
  path: string;
};

export type GeneratedWallet = SolanaWallet | EthereumWallet;

function deriveSolana(mnemonic: string, index = 0): SolanaWallet {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  // account index goes in the {index}' slot
  const path = `m/44'/501'/${index}'/0'`;
  const derivedSeed = derivePath(path, seed.toString('hex')).key;
  const keypair = Keypair.fromSeed(derivedSeed);

  return {
    chain: 'solana',
    mnemonic,
    publicKey: keypair.publicKey.toBase58(),
    secretKey: Buffer.from(keypair.secretKey).toString('hex'),
    index,
    path,
  };
}

function deriveEthereum(mnemonic: string, index = 0) {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const derivationPath = `m/44'/60'/0'/0/${index}`;
  const hdNode = HDNodeWallet.fromSeed(seed);
  const child = hdNode.derivePath(derivationPath);
  const wallet = new Wallet(child.privateKey);

  return {
    chain: 'ethereum' as const,
    mnemonic,
    address: wallet.address,
    privateKey: wallet.privateKey,
    index,
    path: derivationPath,
  };
}


export function generateWallet(chain: SupportedChain, mnemonic?: string, index = 0): GeneratedWallet {
  const usedMnemonic = mnemonic && mnemonic.trim().length > 0
    ? mnemonic.trim()
    : bip39.generateMnemonic();

  if (mnemonic && !bip39.validateMnemonic(usedMnemonic)) {
    throw new Error("Invalid recovery phrase. Please check and try again.");
  }

  return chain === 'solana'
    ? deriveSolana(usedMnemonic, index)
    : deriveEthereum(usedMnemonic, index);
}

// Optional helpers/back-compat
export const handleMnemonic = generateWallet;
export const createWalletForChain = generateWallet;
