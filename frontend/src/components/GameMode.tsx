import { User, Users } from "lucide-react"
import type React from "react"
import type { Dispatch, SetStateAction } from "react"
import { match, P } from "ts-pattern"
import type { GameOptions as GameOptionsType, GameSettings } from "../types"
import GameOptions from "./GameOptions"

interface GameModeSelectorProps {
  settings: GameSettings
  setSettings: Dispatch<SetStateAction<GameSettings>>
  options: GameOptionsType
  onOptionsChange: (options: GameOptionsType) => void
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  settings,
  setSettings,
  options,
  onOptionsChange,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {match(settings)
        .with({ type: P.nullish }, () => (
          <>
            <button
              type="button"
              onClick={() =>
                setSettings((prev) => ({ ...prev, type: "singleplayer" }))
              }
              className="flex-1 py-2 px-4 rounded-lg flex items-center justify-center transition-colors bg-blue-600 text-white"
            >
              <User className="mr-2" size={20} />
              <span>Singleplayer</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSettings((prev) => ({ ...prev, type: "multiplayer" }))
              }}
              className="flex-1 py-2 px-4 rounded-lg flex items-center justify-center transition-colors bg-blue-600 text-white"
            >
              <Users className="mr-2" size={20} />
              <span>Multiplayer</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSettings((prev) => ({ ...prev, type: "multiplayer" }))
              }}
              className="flex-1 py-2 px-4 rounded-lg flex items-center justify-center transition-colors border border-blue-600 text-blue-600"
            >
              <span>Host</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSettings((prev) => ({ ...prev, type: "multiplayer" }))
              }}
              className="flex-1 py-2 px-4 rounded-lg flex items-center justify-center transition-colors border border-blue-600 text-blue-600"
            >
              <span>Join</span>
            </button>
          </>
        ))
        .with({ type: "singleplayer" }, () => (
          <>
            <GameOptions options={options} onOptionsChange={onOptionsChange} />
            <button
              type="button"
              onClick={() =>
                setSettings((prev) => ({ ...prev, type: "singleplayer" }))
              }
              className="flex-1 py-2 px-4 rounded-lg flex items-center justify-center transition-colors bg-blue-600 text-white"
            >
              <span>Create game</span>
            </button>
          </>
        ))
        .with({ type: "multiplayer", mode: P.nullish }, () => (
          <>
            <button
              type="button"
              onClick={() => setSettings((prev) => ({ ...prev, mode: "host" }))}
              className="flex-1 py-2 px-4 rounded-lg flex items-center justify-center transition-colors bg-blue-600 text-white"
            >
              <span>Host</span>
            </button>
            <button
              type="button"
              onClick={() => setSettings((prev) => ({ ...prev, mode: "join" }))}
              className="flex-1 py-2 px-4 rounded-lg flex items-center justify-center transition-colors bg-blue-600 text-white"
            >
              <span>Join</span>
            </button>
          </>
        ))
        .with({ type: "multiplayer", mode: "host" }, () => (
          <>
            <GameOptions options={options} onOptionsChange={onOptionsChange} />
            <button
              type="button"
              onClick={() =>
                setSettings((prev) => ({ ...prev, type: "singleplayer" }))
              }
              className="flex-1 py-2 px-4 rounded-lg flex items-center justify-center transition-colors bg-blue-600 text-white"
            >
              <span>Create room</span>
            </button>
          </>
        ))
        .with({ type: "multiplayer", mode: "join" }, () => (
          <>
            <button
              type="button"
              onClick={() =>
                setSettings((prev) => ({ ...prev, type: "singleplayer" }))
              }
              className="flex-1 py-2 px-4 rounded-lg flex items-center justify-center transition-colors bg-blue-600 text-white"
            >
              <span>Enter room</span>
            </button>
          </>
        ))
        .otherwise(() => null)}
    </div>
  )
}

export default GameModeSelector
