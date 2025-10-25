"use client"

const logoUrl = "/logo.svg"

import { Link } from "@/components/ui/link"

function App() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="max-w-md bg-white rounded-xl border border-gray-300 shadow-xl p-8 text-center">
        <div className="size-[400px] mx-auto -my-[100px]">
          <img
            src={logoUrl}
            alt="Globe Trotters Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Test your geography knowledge! Guess as many countries as you can
          before the timer runs out.
        </p>
        <div className="space-y-3">
          <Link
            href="/lobby"
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Single Player
          </Link>
          <Link
            href="/lobby"
            size="lg"
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Multiplayer
          </Link>
        </div>
      </div>
    </div>
  )
}

export default App
