import { AnimatePresence, motion } from "framer-motion"
import { MapIcon } from "lucide-react"
import type React from "react"
import type { Country } from "../types"

interface GameStatsProps {
  countries: Country[]
  score: number
}

const GameStats: React.FC<GameStatsProps> = ({ countries, score: _score }) => {
  const guessedCountries = countries.filter((country) => country.guessed)

  return (
    <div className="bg-white rounded-xl border border-gray-300 shadow-xl flex flex-col gap-3 p-4 h-full">
      <header className="flex items-center">
        <MapIcon className="mr-2 text-blue-600" />
        <h2 className="font-medium">Countries</h2>
      </header>
      {guessedCountries.length > 0 ? (
        <div className="flex flex-col gap-2 overflow-y-auto">
          <AnimatePresence>
            {guessedCountries.map((country) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
              >
                {country.name}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <p className="text-gray-500 italic">
          No countries guessed yet. Start typing to make your first guess!
        </p>
      )}
    </div>
  )
}

export default GameStats
