import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { ethers } from "ethers";

export type BalanceInfo = {
  balance: string;
  usdValue?: string;
  isLoading: boolean;
  error?: string;
};

const SOLANA_RPC = "https://api.devnet.solana.com";
const ETHEREUM_RPC = "https://rpc.sepolia.org";

export async function fetchSolanaBalance(
  publicKey: string
): Promise<{ balance: string; error?: string }> {
  try {
    const connection = new Connection(SOLANA_RPC, "confirmed");
    const pubKey = new PublicKey(publicKey);
    const balance = await connection.getBalance(pubKey);
    const solBalance = balance / LAMPORTS_PER_SOL;
    return { balance: solBalance.toFixed(4) };
  } catch (error) {
    console.error("Error fetching Solana balance:", error);
    return { balance: "0.0000" };
  }
}

export async function fetchEthereumBalance(
  address: string
): Promise<{ balance: string; error?: string }> {
  try {
    const provider = new ethers.JsonRpcProvider(ETHEREUM_RPC);
    const balance = await provider.getBalance(address);
    const ethBalance = ethers.formatEther(balance);
    return { balance: parseFloat(ethBalance).toFixed(4) };
  } catch (error) {
    console.error("Error fetching Ethereum balance:", error);
    return { balance: "0.0000" };
  }
}

export async function fetchBalance(
  chain: "solana" | "ethereum",
  address: string
): Promise<{ balance: string; error?: string }> {
  if (chain === "solana") {
    return fetchSolanaBalance(address);
  } else {
    return fetchEthereumBalance(address);
  }
}
