import type React from "react"
import type { Country } from "../types"

interface GameStatsProps {
  countries: Country[]
  score: number
}

const GameStats: React.FC<GameStatsProps> = ({ countries, score: _score }) => {
  const guessedCountries = countries.filter((country) => country.guessed)

  return (
    <div className="bg-white rounded-lg shadow flex flex-col gap-3 p-4 h-[600px]">
      <h2 className="text-xl font-bold flex items-center">Countries</h2>
      {guessedCountries.length > 0 ? (
        <div className="flex flex-col gap-2 max-h-fit overflow-y-auto">
          {guessedCountries.map((country) => (
            <div
              key={country.id}
              className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
            >
              {country.name}
            </div>
          ))}
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
