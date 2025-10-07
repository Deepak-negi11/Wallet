/**
 * Mnemonic Wallet Generation Module
 * 
 * This module handles the generation and derivation of cryptocurrency wallets
 * from BIP39 mnemonic phrases (also known as seed phrases or recovery phrases).
 * 
 * What is a Mnemonic?
 * -------------------
 * A mnemonic is a sequence of 12-24 words that serves as a human-readable backup
 * for your cryptocurrency wallet. It follows the BIP39 standard and can be used
 * to recover all your wallet addresses and private keys.
 * 
 * Example mnemonic: "witch collapse practice feed shame open despair creek road again ice least"
 * 
 * Key Concepts:
 * - One mnemonic can generate multiple wallet addresses (using different derivation paths)
 * - Each blockchain (Solana, Ethereum) uses different derivation paths (BIP44)
 * - The mnemonic should be kept secret and secure - anyone with it can access your funds
 * 
 * Supported Chains:
 * - Solana: Uses derivation path m/44'/501'/{index}'/0'
 * - Ethereum: Uses derivation path m/44'/60'/0'/0/{index}
 */

import { Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";
import { HDNodeWallet, Wallet } from "ethers";

/**
 * Supported blockchain networks for wallet generation
 */
export type SupportedChain = 'solana' | 'ethereum';

/**
 * Solana wallet information derived from a mnemonic
 */
export type SolanaWallet = {
  /** The blockchain network */
  chain: 'solana';
  /** The BIP39 mnemonic phrase used to generate this wallet */
  mnemonic: string;
  /** The public key (address) in Base58 format */
  publicKey: string;
  /** The secret key in hexadecimal format */
  secretKey: string;
  /** The account index used in derivation (0, 1, 2, ...) */
  index: number;
  /** The BIP44 derivation path used */
  path: string;
};

/**
 * Ethereum wallet information derived from a mnemonic
 */
export type EthereumWallet = {
  /** The blockchain network */
  chain: 'ethereum';
  /** The BIP39 mnemonic phrase used to generate this wallet */
  mnemonic: string;
  /** The Ethereum address (0x...) */
  address: string;
  /** The private key in hexadecimal format */
  privateKey: string;
  /** The account index used in derivation (0, 1, 2, ...) */
  index: number;
  /** The BIP44 derivation path used */
  path: string;
};

/**
 * Union type representing either a Solana or Ethereum wallet
 */
export type GeneratedWallet = SolanaWallet | EthereumWallet;

/**
 * Derives a Solana wallet from a mnemonic phrase using BIP44 derivation
 * @param mnemonic - The BIP39 mnemonic phrase
 * @param index - The account index (default: 0) for generating multiple wallets from same mnemonic
 * @returns A Solana wallet with public key, secret key, and derivation info
 */
function deriveSolana(mnemonic: string, index = 0): SolanaWallet {
  // Convert mnemonic to a binary seed
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  // BIP44 path for Solana: m/44'/501'/{account_index}'/0'
  // 44' = BIP44, 501' = Solana's coin type, {index}' = account number
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

/**
 * Derives an Ethereum wallet from a mnemonic phrase using BIP44 derivation
 * @param mnemonic - The BIP39 mnemonic phrase
 * @param index - The account index (default: 0) for generating multiple wallets from same mnemonic
 * @returns An Ethereum wallet with address, private key, and derivation info
 */
function deriveEthereum(mnemonic: string, index = 0) {
  // Convert mnemonic to a binary seed
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  // BIP44 path for Ethereum: m/44'/60'/0'/0/{account_index}
  // 44' = BIP44, 60' = Ethereum's coin type, 0'/0 = standard Ethereum path
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


/**
 * Generates or imports a cryptocurrency wallet from a mnemonic phrase
 * 
 * This is the main function for wallet generation. It can either:
 * 1. Generate a new random mnemonic and derive a wallet from it
 * 2. Import an existing mnemonic and derive a wallet from it
 * 
 * @param chain - The blockchain network ('solana' or 'ethereum')
 * @param mnemonic - Optional: existing mnemonic phrase to import. If not provided, generates a new one
 * @param index - The account index for derivation (default: 0). Use different indices to generate multiple wallets from the same mnemonic
 * @returns A wallet object containing the mnemonic, keys, and address
 * @throws Error if the provided mnemonic is invalid
 * 
 * @example
 * // Generate a new Solana wallet
 * const wallet = generateWallet('solana');
 * 
 * @example
 * // Import existing mnemonic
 * const wallet = generateWallet('ethereum', 'witch collapse practice feed shame open despair creek road again ice least');
 * 
 * @example
 * // Generate multiple wallets from same mnemonic
 * const wallet1 = generateWallet('solana', myMnemonic, 0);
 * const wallet2 = generateWallet('solana', myMnemonic, 1);
 */
export function generateWallet(chain: SupportedChain, mnemonic?: string, index = 0): GeneratedWallet {
  // Use provided mnemonic or generate a new one
  const usedMnemonic = mnemonic && mnemonic.trim().length > 0
    ? mnemonic.trim()
    : bip39.generateMnemonic();

  // Validate the mnemonic if one was provided
  if (mnemonic && !bip39.validateMnemonic(usedMnemonic)) {
    throw new Error("Invalid recovery phrase. Please check and try again.");
  }

  // Derive the wallet based on the selected blockchain
  return chain === 'solana'
    ? deriveSolana(usedMnemonic, index)
    : deriveEthereum(usedMnemonic, index);
}

/**
 * Legacy alias for generateWallet - kept for backward compatibility
 * @deprecated Use generateWallet instead
 */
export const handleMnemonic = generateWallet;

/**
 * Legacy alias for generateWallet - kept for backward compatibility
 * @deprecated Use generateWallet instead
 */
export const createWalletForChain = generateWallet;
