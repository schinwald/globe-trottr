import { Clock as ClockIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { trpc } from "@/lib/trpc"
import { useRoom } from "../hooks/room"
import { useSettings } from "../hooks/settings"

interface GameModeModalProps {
  isOpen: boolean
  onClose: () => void
}

const SettingsModal: React.FC<GameModeModalProps> = ({ isOpen, onClose }) => {
  const { roomCode } = useRoom()
  const { delay: defaultDelay, duration: defaultDuration } = useSettings()
  const [delay, setDelay] = useState(defaultDelay)
  const [duration, setDuration] = useState(defaultDuration)

  useEffect(() => {
    setDelay(defaultDelay)
    setDuration(defaultDuration)
  }, [defaultDelay, defaultDuration])

  const gameSettingsChangeMutation =
    trpc.mutationGameSettingsChange.useMutation({
      onSuccess: () => {
        onClose()
      },
    })

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
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <div className="space-y-4">
              {/* Delay */}
              <div className="flex items-center w-full">
                <ClockIcon className="mr-2 text-blue-600 size-6" />
                <span className="mr-2 text-sm font-medium whitespace-nowrap">
                  Delay:
                </span>
                <Select
                  value={delay.toString()}
                  onValueChange={(value) => setDelay(parseInt(value, 10))}
                >
                  <SelectTrigger className="grow-1">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0 seconds</SelectItem>
                    <SelectItem value="1000">1 second</SelectItem>
                    <SelectItem value="2000">2 seconds</SelectItem>
                    <SelectItem value="3000">3 seconds</SelectItem>
                    <SelectItem value="4000">4 seconds</SelectItem>
                    <SelectItem value="5000">5 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Time Limit */}
              <div className="flex items-center w-full">
                <ClockIcon className="mr-2 text-blue-600 size-6" />
                <span className="mr-2 text-sm font-medium whitespace-nowrap">
                  Duration:
                </span>
                <Select
                  value={duration.toString()}
                  onValueChange={(value) => setDuration(parseInt(value, 10))}
                >
                  <SelectTrigger className="grow-1">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60000">1 minute</SelectItem>
                    <SelectItem value="180000">3 minutes</SelectItem>
                    <SelectItem value="300000">5 minutes</SelectItem>
                    <SelectItem value="600000">10 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <Button
            onClick={() => {
              gameSettingsChangeMutation.mutate({
                roomCode,
                delay,
                duration,
              })
            }}
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
