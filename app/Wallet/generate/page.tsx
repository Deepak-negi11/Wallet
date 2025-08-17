"use client";
import React, { useState } from "react";
import Navabar from "../../../components/Navbar";
import { Key } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { generateWallet } from "../../../lib/mnemonic";


const WalletPage = () => {
  const [seedPhrase, setSeedPhrase] = useState("");
  const chain = useSearchParams().get("chain");
  const router = useRouter();

  const onGenerate = () => {
    if (!chain) {
      alert("No chain selected");
      return;
    }
    try {
      // Derive index 0 with provided or new mnemonic to capture the phrase
      const first = generateWallet(chain as 'solana' | 'ethereum', seedPhrase || undefined, 0);

      // Save only what's needed for the display page
      localStorage.setItem(
        "walletSession",
        JSON.stringify({ chain: first.chain, mnemonic: first.mnemonic })
      );

      // Go to display page
      router.push("/Wallet/display");
    } catch (e: any) {
      alert(e?.message || "Failed to generate wallet");
    }
  };

  return (
    <div className="min-h-screen w-full relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 90%, #fff 40%, #6366f1 100%)",
        }}
      />
      <div className="relative z-10">
        <Navabar />

        <div className="flex flex-col items-center justify-start px-6 pt-16 pb-24">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-800">Secret Recovery Phrase</h1>
            <p className="text-md text-gray-600 mt-2">Enter existing phrase or leave blank to generate new</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 max-w-3xl w-full">
            <div className="flex items-center gap-4 py-3 bg-white/60 backdrop-blur-sm rounded-lg border border-white/30">
              <div className="flex items-center justify-center pr-2 rounded-md bg-white/10">
                <Key className="w-5 h-5 text-gray-500 " />
              </div>
              <input
                type="text"
                value={seedPhrase}
                onChange={(e) => setSeedPhrase(e.target.value)}
                placeholder="Existing recovery phrase (optional)"
                className="flex-1 bg-transparent outline-none border-none text-sm text-gray-700 placeholder-gray-400"
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-4 px-1">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-sm border border-gray-200"
              >
                Back
              </button>
              <button
                onClick={onGenerate}
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm shadow-sm"
              >
                Generate & View Wallets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;