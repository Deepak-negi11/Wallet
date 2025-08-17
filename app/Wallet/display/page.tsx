"use client";
import React, { useEffect, useMemo, useState } from "react";
import Navabar from "../../../components/Navbar";
import { useRouter } from "next/navigation";
import { generateWallet, type SupportedChain } from "../../../lib/mnemonic";
import {
  Eye,
  EyeOff,
  Clipboard,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";

type Session = {
  chain: SupportedChain;
  mnemonic: string;
};


export default function DisplayPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [count, setCount] = useState(1);
  const [showSecret, setShowSecret] = useState<Record<number, boolean>>({});
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [phraseOpen, setPhraseOpen] = useState(true);

  // small copy feedback
  const [copied, setCopied] = useState<string | boolean>(false);

  // Load session (chain + mnemonic)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("walletSession");
      if (!raw) return;
      const s = JSON.parse(raw) as Session;
      setSession(s);
    } catch {}
  }, []);

  // Load persisted wallet count (optional convenience)
  useEffect(() => {
    if (!session) return;
    try {
      const saved = localStorage.getItem("walletCount");
      if (saved) {
        const n = Number(saved);
        if (!Number.isNaN(n) && n >= 0) setCount(n);
      } else {
        setCount(1); // default one wallet
      }
    } catch {
      setCount(1);
    }
    // reset secrets whenever session changes
    setShowSecret({});
  }, [session]);

  // Persist count on change
  useEffect(() => {
    try {
      localStorage.setItem("walletCount", String(count));
    } catch {}
  }, [count]);

  // Derive wallets deterministically from the same seed
  const wallets = useMemo(() => {
    if (!session) return [];
    return Array.from({ length: count }, (_, i) =>
      generateWallet(session.chain, session.mnemonic, i)
    );
  }, [session, count]);

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const copyAllAddresses = async () => {
    const data = wallets
      .map((w, i) => {
        const addr = w.chain === "solana" ? w.publicKey : w.address;
        return `#${i + 1} (${w.chain}) ${addr}`;
      })
      .join("\n");
    await copy("addresses", data);
  };

  const downloadCSV = () => {
    const header = "index,chain,address,derivation_path\n";
    const rows = wallets
      .map((w, i) => {
        const addr = w.chain === "solana" ? w.publicKey : w.address;
        const path: string = (w as any).path ?? "";
        return `${i},${w.chain},${addr},${path}`;
      })
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wallet-addresses-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!session) {
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
          <div className="max-w-3xl mx-auto px-6 pt-16 pb-24">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <p className="text-gray-700">No wallet session found.</p>
              <div className="mt-4">
                <button
                  onClick={() => router.push("/Wallet/generate")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm shadow-sm"
                >
                  Go to Generate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const title = `${session.chain[0].toUpperCase() + session.chain.slice(1)} Wallet`;
  const walletCountLabel = count === 1 ? "1 wallet generated" : `${count} wallets generated`;

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

        <div className="max-w-5xl mx-auto flex flex-col gap-6 px-6 pt-16 pb-24 ">


          <div className="bg-white/90 text-gray-900 rounded-xl p-4 shadow-md border border-gray-100 s ">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setPhraseOpen((o) => !o)}
              title={phraseOpen ? "Click to collapse" : "Click to expand"}
            >
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Recovery Phrase</h2>
              </div>
              {phraseOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
            <div>
                <h3 className="text-md text-gray-600 mt-2">
                    Click to reveal your secret phrase
                </h3>
            </div>

            {phraseOpen && (
              <>
                <div className="mt-4 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-md text-gray-700 ">
                    <input
                      type="checkbox"
                      className="accent-blue-500 size-3.5"
                      checked={showMnemonic}
                      onChange={() => setShowMnemonic((s) => !s)}
                    />
                    Show Phrase
                  </label>

                  <button
                    onClick={() => copy("phrase", session.mnemonic)}
                    className="text-xs flex items-center gap-2 px-3 py-1.5 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90"
                    title="Copy to clipboard"
                  >
                    <Clipboard size={14} />
                    {copied === "phrase" ? "Copied" : "Copy to Clipboard"}
                  </button>
                </div>

                <div
                  className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
                >
                  {session.mnemonic.split(/\s+/).map((w, i) => (
                    <div
                      key={`${w}-${i}`}
                      className="rounded-md bg-gray-50 border border-gray-200 px-3 py-2 flex items-center justify-between"
                    >
                      <span className="text-gray-500 text-xs mr-2">{i + 1}.</span>
                      <span className="font-medium">
                        {showMnemonic ? w : "••••••"}
                      </span>
                    </div>
                  ))}
                </div>

                
              </>
            )}
          </div>

    
          <div className="flex items-center justify-between mt-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Your Wallets</h2>
              <div className="text-md text-gray-800 mt-1">{walletCountLabel}</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCount((c) => c + 1)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:opacity-80 text-white rounded-md hover:bg-blue-700 text-sm items-center shadow-sm"
              >
                + Add Wallet
              </button>
              <button
                onClick={() => {
                  setCount(0);
                  setShowSecret({});
                }}
                className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors text-sm"
              >
                Clear All
              </button>
            </div>
          </div>
          {wallets.length > 0 && (
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={copyAllAddresses}
                className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-700  text-white rounded-md transition-colors text-xs  shadow-sm hover:opacity-90"
                title="Copy all addresses"
              >
                Copy All Addresses
              </button>
              <button
                onClick={downloadCSV}
                className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md hover:bg-violet-700 transition-colors text-xs shadow-sm "
                title="Download CSV (public info)"
              >
                Download
              </button>
            </div>
          )}


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wallets.map((w, i) => {
              const isSol = w.chain === "solana";
              const address = isSol ? w.publicKey : w.address;
              const secret = isSol ? w.secretKey : w.privateKey;

              const iconSrc = isSol ? "/solana.svg" : "/ethereum.png"; 
              const chainLabel = isSol ? "Solana" : "Ethereum";

              return (
                <div
                  key={`${w.chain}-${i}-${(w as any).path}`}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-4"
                >
                 
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                 
                        <Image
                          src={iconSrc}
                          alt={`${chainLabel} logo`}
                          width={16}
                          height={16}
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-medium text-gray-800">
                          Wallet #{i + 1}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{chainLabel}</div>
                    </div>
                    <button
                      onClick={() => setCount((c) => Math.max(0, c - 1))}
                      title="Remove last wallet"
                      className="p-2 rounded-md bg-white border border-gray-200 hover:bg-gray-50 text-gray-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                 
                  <label className="text-xs font-medium text-gray-600">Public Address</label>
                  <div className="relative mt-1 mb-3">
                    <input
                      readOnly
                      value={address}
                      className="w-full text-sm font-mono bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-9 py-2 text-gray-800"
                    />
                    <button
                      onClick={() => copy(`addr-${i}`, address)}
                      className="absolute right-1.5 top-1.5 p-1.5 rounded-md bg-white border border-gray-200 hover:bg-gray-50 text-gray-600"
                      title="Copy address"
                    >
                      <Clipboard size={14} />
                    </button>
                  </div>

                 
                  <label className="text-xs font-medium text-gray-600">Private Key</label>
                  <div className="relative mt-1">
                    <input
                      readOnly
                      type={showSecret[i] ? "text" : "password"}
                      value={secret}
                      className="w-full text-sm font-mono bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-20 py-2 text-gray-800"
                    />
                    <button
                      onClick={() => setShowSecret((m) => ({ ...m, [i]: !m[i] }))}
                      className="absolute right-9 top-1.5 p-1.5 rounded-md bg-white border border-gray-200 hover:bg-gray-50 text-gray-600"
                      title={showSecret[i] ? "Hide private key" : "Show private key"}
                    >
                      {showSecret[i] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      onClick={() => copy(`sec-${i}`, secret)}
                      className="absolute right-1.5 top-1.5 p-1.5 rounded-md bg-white border border-gray-200 hover:bg-gray-50 text-gray-600"
                      title="Copy private key"
                    >
                      <Clipboard size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
            
          </div>

        
        </div>
      </div>
    </div>
  );
}