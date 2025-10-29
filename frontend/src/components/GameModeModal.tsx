import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { GameSettings, GameState } from "../types"
import GameOptions from "./GameOptions"

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
  options,
  onOptionsChange,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <GameOptions options={options} onOptionsChange={onOptionsChange} />
          <Button
            onClick={() => onClose()}
            className="flex-1 py-2 px-4 flex items-center justify-center"
          >
            <span>Save</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GameModeModal
