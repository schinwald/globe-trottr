import { AnimatePresence, motion } from "framer-motion"

interface AnimateNumberProps {
  value?: string
  duration?: number
  className?: string
}

const AnimateCountdown: React.FC<AnimateNumberProps> = ({
  value,
  duration = 0.2,
  className,
}) => {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration, ease: "easeOut" }}
        className={className}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  )
}

export { AnimateCountdown }
