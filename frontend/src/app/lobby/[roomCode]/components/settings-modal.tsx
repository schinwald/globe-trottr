import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface GameModeModalProps {
  isOpen: boolean
  onClose: () => void
}

const SettingsModal: React.FC<GameModeModalProps> = ({ isOpen, onClose }) => {
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
          {/* <GameOptions options={options} onOptionsChange={onOptionsChange} /> */}
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

export { SettingsModal }
