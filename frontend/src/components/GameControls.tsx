import { LightbulbIcon, SendIcon } from "lucide-react"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import type { Country } from "../types"

interface GameControlsProps {
  onGuess: (guess: string) => void
  onRequestHint: () => void
  gameStarted: boolean
  gameOver: boolean
  score: number
  totalCountries: number
  countries: Country[]
  currentHint: string | null
  hintsUsed: number
  maxHints: number
}

const GameControls: React.FC<GameControlsProps> = ({
  onGuess,
  onRequestHint,
  gameStarted,
  gameOver,
  score,
  totalCountries,
  currentHint,
  hintsUsed,
  maxHints,
}) => {
  const [guess, setGuess] = useState("")
  const [recentGuesses, setRecentGuesses] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (gameStarted && !gameOver && inputRef.current) {
      inputRef.current.focus()
    }
  }, [gameStarted, gameOver])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!guess.trim() || !gameStarted || gameOver) return

    onGuess(guess)

    // Add to recent guesses
    setRecentGuesses((prev) => {
      const newGuesses = [guess, ...prev]
      return newGuesses.slice(0, 5) // Keep only the 5 most recent guesses
    })

    setGuess("")
  }

  return (
    <div className="w-full mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col justify-end gap-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter a country name..."
            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={gameOver}
            autoComplete="off"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white py-2 px-2 rounded-md hover:bg-blue-700 transition-colors"
            disabled={gameOver}
          >
            <SendIcon size={14} />
          </button>
        </div>
        <button
          type="button"
          onClick={onRequestHint}
          className="flex items-center justify-center gap-1 py-2 px-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:bg-gray-400"
          disabled={gameOver || hintsUsed >= maxHints}
        >
          <LightbulbIcon size={14} />
          {maxHints > hintsUsed ? `Hint #${hintsUsed + 1}` : "No more hints!"}
        </button>
        {gameStarted && !gameOver && recentGuesses.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recentGuesses.map((g, _i) => (
              <span
                key={g}
                className="px-2 py-1 bg-gray-100 rounded-md text-sm"
              >
                {g}
              </span>
            ))}
          </div>
        )}

        {currentHint && (
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
            <p className="text-amber-800 font-medium">Hint: {currentHint}</p>
          </div>
        )}
      </form>
    </div>
  )
}

export default GameControls
