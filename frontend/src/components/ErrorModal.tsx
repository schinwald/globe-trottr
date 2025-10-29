import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { ErrorType } from "@/utils/errors"

interface GameModeModalProps {
  isOpen: boolean
  error?: ErrorType
  onClose: () => void
}

const GameModeModal: React.FC<GameModeModalProps> = ({
  isOpen,
  onClose,
  error,
}) => {
  if (!error) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{error.title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">{error.message}</div>
      </DialogContent>
    </Dialog>
  )
}

export default GameModeModal
