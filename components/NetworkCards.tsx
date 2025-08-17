"use client"

import Image from 'next/image'
import { useRouter } from 'next/navigation'

const NetworkCards = () => {
  const router = useRouter()

  const networks = [
    {
      id: 'solana',
      name: 'Solana',
      description: 'High-performance blockchain for decentralized apps',
      icon: '/solana.svg',
      bgColor: 'bg-white/80'
    },
    {
      id: 'ethereum', 
      name: 'Ethereum',
      description: 'Decentralized platform for smart contract applications',
      icon: '/ethereum.png',
      bgColor: 'bg-white/80'
    }
  ]




const handleCardClick = (networkId: string): void => {
    router.push(`/Wallet/generate?chain=${networkId}`);
}

  return (
    <div className='flex gap-6 justify-center'>
      {networks.map((network) => (
        <div 
          key={network.id}
          onClick={() => handleCardClick(network.id)}
          className={`
            ${network.bgColor} backdrop-blur-sm rounded-xl p-6 cursor-pointer 
            hover:bg-white/90 hover:scale-105 active:scale-95
            transition-all duration-200 shadow-lg border border-white/20 min-w-[280px]
          `}
        >
          <div className='flex items-start gap-4'>
            <Image 
              src={network.icon} 
              alt={`${network.name} logo`}
              width={32}
              height={32}
              className='w-8 h-8'
            />
            <div className='flex-1'>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                {network.name}
              </h3>
              <p className='text-sm text-gray-600 leading-relaxed'>
                {network.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default NetworkCards