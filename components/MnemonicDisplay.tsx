'use client'
import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Navabar from '../components/Navbar'

const CreateWalletPage = () => {
  const searchParams = useSearchParams()
  const network = searchParams.get('network') || 'solana'
  const [seedPhrase, setSeedPhrase] = useState('')

  const generateSeedPhrase = () => {
    // Mock seed phrase generation - replace with real crypto library
    const words = [
      'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
      'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid'
    ]
    const generated = Array.from({length: 12}, () => 
      words[Math.floor(Math.random() * words.length)]
    ).join(' ')
    setSeedPhrase(generated)
  }

  return (
    <div className="min-h-screen w-full relative">
      {/* Background Gradient */}
      <div    
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #6366f1 100%)",
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <Navabar />
        
        <div className="flex flex-col items-center justify-center px-6 py-16">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Save these words in a safe place
            </h1>
            <p className="text-gray-600">
              Selected network: <span className="font-semibold capitalize">{network}</span>
            </p>
          </div>
          
          {/* Seed Phrase Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20 max-w-md w-full mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter existing phrase (or leave blank to generate new)
              </label>
              <textarea
                value={seedPhrase}
                onChange={(e) => setSeedPhrase(e.target.value)}
                placeholder="Enter your seed phrase here..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>
            
            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => window.history.back()}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              
              <button
                onClick={generateSeedPhrase}
                className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Generate Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateWalletPage