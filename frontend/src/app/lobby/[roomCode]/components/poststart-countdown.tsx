import { Timer as TimerIcon } from "lucide-react"
import { useShallow } from "zustand/shallow"
import { cn } from "@/lib/utils"
import { useGameStore } from "../hooks/room"

type PostStartCountdownProps = {
  className?: string
}

const PostStartCountdown: React.FC<PostStartCountdownProps> = ({
  className,
}) => {
  const { timer, settings } = useGameStore(
    useShallow((store) => ({
      timer: store.timer,
      settings: store.settings,
      delay: store.settings.delay,
    }))
  )

  const getTime = () => {
    if (timer === null) return formatTime(settings.duration)
    const countdown = settings.duration + settings.delay - timer
    const clamped = Math.max(0, Math.min(countdown, settings.duration))
    const seconds = Math.floor(clamped / 1000)
    return formatTime(seconds)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const time = getTime()

  return (
    <div className={cn(className, "flex items-center")}>
      <TimerIcon className="mr-1 text-blue-600" size={20} />
      <span className="text-xl font-bold">{time}</span>{" "}
    </div>
  )
}

export { PostStartCountdown }
