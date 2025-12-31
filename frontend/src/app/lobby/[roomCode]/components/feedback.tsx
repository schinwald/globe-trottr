import { AnimatePresence, motion } from "framer-motion"
import { useRef } from "react"
import { useShallow } from "zustand/shallow"
import { cn } from "@/lib/utils"
import { useGameStore } from "../hooks/room"

type FeedbackProps = {
  className?: string
}

const Feedback: React.FC<FeedbackProps> = ({ className }) => {
  const ref = useRef<NodeJS.Timeout>()
  const { guess, dismissGuess } = useGameStore(
    useShallow((store) => ({
      guess: store.guess,
      dismissGuess: store.dismissGuess,
    }))
  )

  const getMessageType = (score?: number) => {
    if (score === undefined) return undefined

    if (score === 1) {
      return "correct" as const
    } else {
      return "wrong" as const
    }
  }

  type MessageType = NonNullable<ReturnType<typeof getMessageType>>

  const messagesByType: Record<MessageType, string[]> = {
    correct: ["Correct!", "Nice job!", "You got it right!"],
    wrong: ["Wrong!", "Not quite!", "Not even close..."],
  }

  const getMessageText = (type?: MessageType) => {
    if (type === undefined) return ""
    const messages = messagesByType[type]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  const type = getMessageType(guess?.score)
  const text = getMessageText(type)

  return (
    <AnimatePresence mode="wait">
      {type ? (
        <motion.span
          key={type}
          className={className}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{
            duration: 0.1,
            onComplete: () => {
              if (ref.current) clearTimeout(ref.current)
              ref.current = setTimeout(() => dismissGuess(), 1500)
            },
          }}
        >
          <span
            className={cn({
              "text-green-400": type === "correct",
              "text-red-400": type === "wrong",
            })}
          >
            {text}
          </span>
        </motion.span>
      ) : null}
    </AnimatePresence>
  )
}

export { Feedback }
