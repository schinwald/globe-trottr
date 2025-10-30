export interface Country {
  id: string
  name: string
  iso: string
  guessed: boolean
  matches: string[]
}

export interface GameState {
  countries: Country[]
  timeLeft: number
  gameStarted: boolean
  gameOver: boolean
  score: number
  totalCountries: number
  hintsUsed: number
  currentHint: string | null
  guessedCountry: Country | null
  gameOptions: GameOptions
  notifications: Notification[]
  countdown: number | null
}

export interface GameOptions {
  timeLimit: number
  continentFilter: string[]
  searchAccuracy: "strict" | "fuzzy"
  maxHints: number
}

export type SingleplayerGameSettings = {
  type: "singleplayer"
  options: GameOptions
}

export type MultiplayerGameSettings = {
  type: "multiplayer"
  mode: "host" | "join"
  options: GameOptions
}

export type GameSettings = Partial<
  SingleplayerGameSettings | MultiplayerGameSettings
>

export interface Notification {
  id: string
  message: string
  type: "success" | "info"
  timestamp: number
}
