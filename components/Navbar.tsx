import React from 'react'
import { Ghost } from "lucide-react"

const Navabar = () => {
  return (
  
    <nav className="w-full relative z-10">
      <div className="max-w mx-auto px-6 py-3 flex items-center justify-between
                     backdrop-blur-sm rounded-b-md">
        <div className="flex items-center gap-3 ">
          <Ghost className="h-6 w-6 text-gray-800" />
          <span className="text-xl font-semibold text-gray-800 ">Zengo</span>
        </div>

        <div className="text-sm text-gray-600 pr-5">
          v1.0
        </div>
      </div>
      <div className="w-full h-px bg-white/20" />
    </nav>
  )
}

export default Navabar