import { AnimatePresence, motion } from "framer-motion"
import { useShallow } from "zustand/shallow"
import { useGameStore } from "../../hooks/room"

type PreStartCountdownProps = {
  className?: string
}

const PreStartCountdown: React.FC<PreStartCountdownProps> = ({ className }) => {
  const { timer, settings } = useGameStore(
    useShallow((store) => ({
      timer: store.timer,
      settings: store.settings,
    }))
  )

  const getTime = () => {
    if (timer === null) return null
    const milliseconds = settings.delay - timer + 1000
    if (milliseconds < 0) return null
    if (settings.delay + 1000 <= milliseconds) return null

    const seconds = Math.floor(milliseconds / 1000)
    if (seconds === 0) return "GO!"
    return seconds.toString()
  }

  const time = getTime()
  if (time === null) return null

  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={time}
        className={className}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {time}
      </motion.span>
    </AnimatePresence>
  )
}

export { PreStartCountdown }
