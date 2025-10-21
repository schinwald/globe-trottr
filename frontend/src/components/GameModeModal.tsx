import { User, Users } from "lucide-react"
import { match, P } from "ts-pattern"
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
  settings,
  setSettings,
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
          <DialogTitle>
            {match(settings)
              .with({ type: P.nullish }, () => "Welcome")
              .with({ type: "singleplayer" }, () => "Settings")
              .with(
                { type: "multiplayer", mode: P.nullish },
                () => "Multiplayer"
              )
              .with(
                { type: "multiplayer", mode: "host" },
                () => "Host Settings"
              )
              .with({ type: "multiplayer", mode: "join" }, () => "Join Room")
              .otherwise(() => "Settings")}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {match(settings)
            .with({ type: P.nullish }, () => (
              <>
                <Button
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, type: "singleplayer" }))
                  }
                  className="flex-1 py-2 px-4 flex items-center justify-center"
                >
                  <User className="mr-2" size={20} />
                  <span>Singleplayer</span>
                </Button>
                <Button
                  onClick={() => {
                    setSettings((prev) => ({ ...prev, type: "multiplayer" }))
                  }}
                  className="flex-1 py-2 px-4 flex items-center justify-center"
                >
                  <Users className="mr-2" size={20} />
                  <span>Multiplayer</span>
                </Button>
              </>
            ))
            .with({ type: "singleplayer" }, () => (
              <>
                <GameOptions
                  options={options}
                  onOptionsChange={onOptionsChange}
                />
                <Button
                  onClick={() => onClose()}
                  className="flex-1 py-2 px-4 flex items-center justify-center"
                >
                  <span>Create game</span>
                </Button>
              </>
            ))
            .with({ type: "multiplayer", mode: P.nullish }, () => (
              <>
                <Button
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, mode: "host" }))
                  }
                  className="flex-1 py-2 px-4 flex items-center justify-center"
                >
                  <span>Host</span>
                </Button>
                <Button
                  onClick={() =>
                    setSettings((prev) => ({ ...prev, mode: "join" }))
                  }
                  className="flex-1 py-2 px-4 flex items-center justify-center"
                >
                  <span>Join</span>
                </Button>
              </>
            ))
            .with({ type: "multiplayer", mode: "host" }, () => (
              <>
                <GameOptions
                  options={options}
                  onOptionsChange={onOptionsChange}
                />
                <Button
                  onClick={() => onClose()}
                  className="flex-1 py-2 px-4 flex items-center justify-center"
                >
                  <span>Create room</span>
                </Button>
              </>
            ))
            .with({ type: "multiplayer", mode: "join" }, () => (
              <>
                <Button
                  onClick={() => onClose()}
                  className="flex-1 py-2 px-4 flex items-center justify-center"
                >
                  <span>Enter room</span>
                </Button>
              </>
            ))
            .otherwise(() => null)}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GameModeModal
