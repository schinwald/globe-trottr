import { AnimatePresence, motion } from "framer-motion"
import { MapIcon } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { trpc } from "@/lib/trpc"
import type { Country } from "../../../backend/src/utils/countries"

interface GameStatsProps {
  roomCode: string
}

const GameStats: React.FC<GameStatsProps> = ({ roomCode }) => {
  const [countries, setCountries] = useState<
    (Country & { guessed: boolean })[]
  >([])

  trpc.subscriptionRoomCountryStatuses.useSubscription(
    {
      roomCode,
    },
    {
      onData: (data) => {
        setCountries(data.countries)
      },
    }
  )

  const guessedCountries = countries.filter((country) => country.guessed)

  return (
    <div className="bg-white rounded-xl border border-gray-300 shadow-xl flex flex-col gap-4 p-4 h-full">
      <div className="flex justify-between">
        <header className="flex items-center">
          <MapIcon className="mr-2 text-blue-600" />
          <h2 className="font-medium">Countries</h2>
        </header>
        <span>
          {guessedCountries.length} / {countries.length}
        </span>
      </div>
      <div className="rounded-lg outline-gray-200 outline-1 border-10 border-white flex flex-col overflow-y-auto gap-2 h-full">
        {guessedCountries.length > 0 ? (
          <AnimatePresence>
            {guessedCountries.map((country) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm"
              >
                {country.name}
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <p className="text-gray-500 italic text-sm px-3 py-1">
            No countries guessed yet
          </p>
        )}
      </div>
    </div>
  )
}

export default GameStats
