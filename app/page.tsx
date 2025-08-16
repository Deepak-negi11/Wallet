import React from 'react'
import Navabar from '../components/Navbar'
import NetworkCards from '../components/NetworkCards'

const page = () => {
  return (
    <>
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
          {/* Navbar */}
          <Navabar />
          
          {/* Main Content */}
          <div className="flex flex-col items-center justify-center px-6 py-16">
            {/* Title Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Select Blockchain Network
              </h1>
              <p className="text-lg text-gray-600 max-w-md">
                Choose where you want to generate your wallet
              </p>
            </div>
            
            {/* Network Cards */}
            <NetworkCards />
          </div>
        </div>
      </div>
    </>  
  )
}

export default page