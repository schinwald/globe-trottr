'use client'

import { SendIcon } from "lucide-react"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Country } from "../types"

interface GameControlsProps {
  onGuess: (guess: string) => void
  gameStarted: boolean
  gameOver: boolean
  countries: Country[]
}

const GameControls: React.FC<GameControlsProps> = ({
  onGuess,
  gameStarted,
  gameOver,
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
    <div className="w-full mx-auto p-6">
      <form onSubmit={handleSubmit} className="flex flex-col justify-end gap-4">
        <div className="flex flex-row gap-2">
          <Input
            ref={inputRef}
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter a country name..."
            disabled={gameOver}
            autoComplete="off"
          />
          <Button type="submit" disabled={gameOver}>
            <SendIcon className="size-4" />
          </Button>
        </div>
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
      </form>
    </div>
  )
}

export default GameControls
