import type { GameSettings, GameState } from "../types"
import GameModeSelector from "./GameMode"

interface GameModeModalProps {
  isOpen: boolean
  settings: GameSettings
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>
  options: GameState["gameOptions"]
  onOptionsChange: (options: GameState["gameOptions"]) => void
  onClose: () => void
}

const GameModeModal: React.FC<GameModeModalProps> = ({
  isOpen,
  settings,
  setSettings,
  options,
  onOptionsChange,
  onClose,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Game Settings</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <GameModeSelector
          settings={settings}
          setSettings={setSettings}
          options={options}
          onOptionsChange={onOptionsChange}
        />
      </div>
    </div>
  )
}

export default GameModeModal

