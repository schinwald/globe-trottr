import { Clock, Globe, HelpCircle, Search } from "lucide-react"
import type React from "react"
import { useId } from "react"
import type { GameOptions as GameOptionsType } from "../types"

interface GameOptionsProps {
  options: GameOptionsType
  onOptionsChange: (options: GameOptionsType) => void
}

const continents = [
  { id: "africa", name: "Africa" },
  { id: "asia", name: "Asia" },
  { id: "europe", name: "Europe" },
  { id: "north-america", name: "North America" },
  { id: "oceania", name: "Oceania" },
  { id: "south-america", name: "South America" },
]

const GameOptions: React.FC<GameOptionsProps> = ({
  options,
  onOptionsChange,
}) => {
  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onOptionsChange({
      ...options,
      timeLimit: Number.parseInt(e.target.value, 10),
    })
  }

  const handleAccuracyChange = (accuracy: "strict" | "fuzzy") => {
    onOptionsChange({
      ...options,
      searchAccuracy: accuracy,
    })
  }

  const handleContinentToggle = (continentId: string) => {
    const newContinents = options.continentFilter.includes(continentId)
      ? options.continentFilter.filter((id) => id !== continentId)
      : [...options.continentFilter, continentId]

    onOptionsChange({
      ...options,
      continentFilter: newContinents,
    })
  }

  const handleHintChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onOptionsChange({
      ...options,
      maxHints: Number.parseInt(e.target.value, 10),
    })
  }

  const disabled = false
  const timeLimitId = useId()
  const maxHintsId = useId()

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="space-y-4">
        {/* Time Limit */}
        <div className="flex items-center">
          <Clock className="mr-2 text-blue-600" size={18} />
          <label htmlFor={timeLimitId} className="mr-2 text-sm font-medium">
            Time Limit:
          </label>
          <select
            id={timeLimitId}
            value={options.timeLimit}
            onChange={handleTimeChange}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={60}>1 minute</option>
            <option value={180}>3 minutes</option>
            <option value={300}>5 minutes</option>
            <option value={600}>10 minutes</option>
          </select>
        </div>

        {/* Max Hints */}
        <div className="flex items-center">
          <HelpCircle className="mr-2 text-blue-600" size={18} />
          <label htmlFor={maxHintsId} className="mr-2 text-sm font-medium">
            Max Hints:
          </label>
          <select
            id={maxHintsId}
            value={options.maxHints}
            onChange={handleHintChange}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={3}>3 hints</option>
            <option value={5}>5 hints</option>
            <option value={10}>10 hints</option>
            <option value={999}>Unlimited</option>
          </select>
        </div>

        {/* Search Accuracy */}
        <div>
          <div className="flex items-center mb-2">
            <Search className="mr-2 text-blue-600" size={18} />
            <span className="text-sm font-medium">Search Accuracy:</span>
          </div>
          <div className="flex space-x-3 ml-6">
            <button
              type="button"
              onClick={() => handleAccuracyChange("strict")}
              disabled={disabled}
              className={`px-3 py-1 text-sm rounded ${
                options.searchAccuracy === "strict"
                  ? "bg-blue-100 text-blue-700 border border-blue-300"
                  : "bg-gray-100 text-gray-700 border border-gray-200"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Strict
            </button>
            <button
              type="button"
              onClick={() => handleAccuracyChange("fuzzy")}
              disabled={disabled}
              className={`px-3 py-1 text-sm rounded ${
                options.searchAccuracy === "fuzzy"
                  ? "bg-blue-100 text-blue-700 border border-blue-300"
                  : "bg-gray-100 text-gray-700 border border-gray-200"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Fuzzy
            </button>
          </div>
        </div>

        {/* Continent Filter */}
        <div>
          <div className="flex items-center mb-2">
            <Globe className="mr-2 text-blue-600" size={18} />
            <span className="text-sm font-medium">Filter Continents:</span>
          </div>
          <div className="flex flex-wrap gap-2 ml-6">
            {continents.map((continent) => (
              <button
                type="button"
                key={continent.id}
                onClick={() => handleContinentToggle(continent.id)}
                disabled={disabled}
                className={`px-3 py-1 text-sm rounded ${
                  options.continentFilter.includes(continent.id)
                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                    : "bg-gray-100 text-gray-700 border border-gray-200"
                } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {continent.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameOptions
