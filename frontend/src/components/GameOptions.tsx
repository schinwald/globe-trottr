import { Clock, Globe, HelpCircle, Search } from "lucide-react"
import type React from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  const handleTimeChange = (value: string) => {
    onOptionsChange({
      ...options,
      timeLimit: Number.parseInt(value, 10),
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

  const handleHintChange = (value: string) => {
    onOptionsChange({
      ...options,
      maxHints: Number.parseInt(value, 10),
    })
  }

  const disabled = false

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
      <div className="space-y-4">
        {/* Time Limit */}
        <div className="flex items-center w-full">
          <Clock className="mr-2 text-blue-600 size-6" />
          <span className="mr-2 text-sm font-medium whitespace-nowrap">
            Time Limit:
          </span>
          <Select
            value={options.timeLimit.toString()}
            onValueChange={handleTimeChange}
          >
            <SelectTrigger className="grow-1">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="60">1 minute</SelectItem>
              <SelectItem value="180">3 minutes</SelectItem>
              <SelectItem value="300">5 minutes</SelectItem>
              <SelectItem value="600">10 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Max Hints */}
        <div className="flex items-center w-full">
          <HelpCircle className="mr-2 text-blue-600 size-6" />
          <span className="mr-2 text-sm font-medium whitespace-nowrap">
            Max Hints:
          </span>
          <Select
            value={options.maxHints.toString()}
            onValueChange={handleHintChange}
          >
            <SelectTrigger className="grow-1">
              <SelectValue placeholder="Select hints" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 hints</SelectItem>
              <SelectItem value="5">5 hints</SelectItem>
              <SelectItem value="10">10 hints</SelectItem>
              <SelectItem value="999">Unlimited</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Accuracy */}
        <div>
          <div className="flex items-center mb-2">
            <Search className="mr-2 text-blue-600" size={18} />
            <span className="text-sm font-medium">Search Accuracy:</span>
          </div>
          <div className="flex gap-2 ml-6">
            <Button
              onClick={() => handleAccuracyChange("strict")}
              disabled={disabled}
              variant={
                options.searchAccuracy === "strict" ? "secondary" : "outline"
              }
              size="xs"
            >
              Strict
            </Button>
            <Button
              onClick={() => handleAccuracyChange("fuzzy")}
              disabled={disabled}
              variant={
                options.searchAccuracy === "fuzzy" ? "secondary" : "outline"
              }
              size="xs"
            >
              Fuzzy
            </Button>
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
              <Button
                key={continent.id}
                onClick={() => handleContinentToggle(continent.id)}
                disabled={disabled}
                variant={
                  options.continentFilter.includes(continent.id)
                    ? "secondary"
                    : "outline"
                }
                size="xs"
              >
                {continent.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameOptions
