import { useCallback, useEffect, useState } from "react"
import { mockFriends } from "../constants/mockData"
import { countries as countriesData } from "../data/countries"
import type { GameSettings, GameState } from "../types"
import { getHintForRandomCountry } from "../utils/hints"
import { normalizeCountryName } from "../utils/normalize"

const DEFAULT_GAME_TIME = 300 // 5 minutes in seconds

export function useGameState() {
  const [settings, setSettings] = useState<GameSettings>({
    type: undefined,
    mode: undefined,
  })
  const [gameState, setGameState] = useState<GameState>({
    timeLeft: DEFAULT_GAME_TIME,
    gameStarted: false,
    gameOver: false,
    score: 0,
    totalCountries: countriesData.length,
    hintsUsed: 0,
    currentHint: null,
    countries: countriesData.map((country) => ({
      ...country,
      guessed: true,
    })),
    guessedCountry: null,
    gameOptions: {
      timeLimit: DEFAULT_GAME_TIME,
      continentFilter: [],
      searchAccuracy: "fuzzy",
      maxHints: 3,
    },
    friends: [],
    notifications: [],
  })

  const startGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      gameStarted: true,
      gameOver: false,
      timeLeft: DEFAULT_GAME_TIME,
      score: 0,
      hintsUsed: 0,
      currentHint: null,
      countries: countriesData.map((country) => ({
        ...country,
        guessed: false,
      })),
      gameOptions: {
        timeLimit: DEFAULT_GAME_TIME,
        continentFilter: [],
        searchAccuracy: "fuzzy",
        maxHints: 3,
      },
      friends: mockFriends,
      notifications: [],
    }))
  }, [])

  // Update game options
  const handleOptionsChange = useCallback(
    (options: GameState["gameOptions"]) => {
      setGameState((prev) => ({
        ...prev,
        gameOptions: options,
        timeLeft: options.timeLimit,
      }))
    },
    []
  )

  const restartGame = useCallback(() => {
    startGame()
  }, [startGame])

  const handleGuess = (guess: string) => {
    const normalizedGuess = normalizeCountryName(guess)
    const guessedCountry = gameState.countries.find((country) => {
      return (
        normalizeCountryName(country.name) === normalizedGuess &&
        !country.guessed
      )
    })

    setGameState((prev) => {
      const updatedCountries = prev.countries.map((country) => {
        if (country.id === guessedCountry?.id)
          return { ...country, guessed: true }
        return country
      })

      const newScore = updatedCountries.filter((c) => c.guessed).length

      return {
        ...prev,
        countries: updatedCountries,
        guessedCountry: guessedCountry,
        score: newScore,
      }
    })
  }

  const requestHint = useCallback(() => {
    setGameState((prev) => {
      const hint = getHintForRandomCountry(prev.countries)
      return {
        ...prev,
        hintsUsed: prev.hintsUsed + 1,
        currentHint: hint,
      }
    })
  }, [])

  // Timer effect
  useEffect(() => {
    let timer: number | undefined

    if (
      gameState.gameStarted &&
      !gameState.gameOver &&
      gameState.timeLeft > 0
    ) {
      timer = window.setInterval(() => {
        setGameState((prev) => {
          const newTimeLeft = prev.timeLeft - 1
          if (newTimeLeft <= 0) {
            clearInterval(timer)
            return { ...prev, timeLeft: 0, gameOver: true }
          }
          return { ...prev, timeLeft: newTimeLeft }
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [gameState.gameStarted, gameState.gameOver, gameState.timeLeft])

  return {
    settings,
    setSettings,
    gameState,
    startGame,
    handleOptionsChange,
    restartGame,
    handleGuess,
    requestHint,
    hintsUsed: gameState.hintsUsed,
  }
}
