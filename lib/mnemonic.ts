import * as bip39 from "bip39";
import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import { mnemonicToSeed } from "bip39";

export function generateSolanaWallet() {
  const mnemonic = bip39.generateMnemonic();
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const path = `m/44'/501'/0'/0'`;
  const derivedSeed = derivePath(path, seed.toString("hex")).key;
  const keypair = Keypair.fromSeed(derivedSeed);
  
  return {
    mnemonic,
    publicKey: keypair.publicKey.toBase58(),
    secretKey: Buffer.from(keypair.secretKey).toString("hex"),
  };
}

import { Wallet, HDNodeWallet } from "ethers";

import { ethers } from "ethers";

export async function generateEthereumWallet() {
  const mnemonic = bip39.generateMnemonic();
  const seed = await mnemonicToSeed(mnemonic);
                const derivationPath = `m/44'/60'/0'/0'`;
                 const hdNode = HDNodeWallet.fromSeed(seed);
                 const child = hdNode.derivePath(derivationPath);
                 const privateKey = child.privateKey;
                 const wallet = new Wallet(privateKey);

  return {
    mnemonic,
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
}
