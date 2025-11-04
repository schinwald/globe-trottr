"use client"

import { AnimatePresence, motion } from "framer-motion"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"

export type PreStartTimerRef = {
  start: (time: number) => void
}

type PreStartTimerProps = {
  className?: string
  duration: number
  onComplete?: () => void
}

const PreStartTimer = forwardRef<PreStartTimerRef, PreStartTimerProps>(
  ({ className, duration, onComplete }, ref) => {
    const [startTime, setStartTime] = useState<number | null>(null)
    const [time, setTime] = useState<number | null>(null)

    useImperativeHandle(ref, () => ({
      start: (time: number) => {
        setStartTime(time)
      },
    }))

    useEffect(() => {
      if (startTime === null) return

      const currentTime = Date.now()
      const elapsedTime = currentTime - startTime
      const timeLeft = duration - elapsedTime
      if (timeLeft < 0) return

      let interval: number | undefined
      interval = window.setInterval(() => {
        setTime(() => {
          if (startTime === null) {
            clearInterval(interval)
            return null
          }

          const currentTime = Date.now()
          const elapsedTime = currentTime - startTime

          if (elapsedTime < 0) {
            return null
          }

          const timeLeft = duration - elapsedTime

          if (timeLeft < 0) {
            clearInterval(interval)
            onComplete?.()
            return null
          }

          return timeLeft
        })
      }, 1000)

      return () => {
        if (interval) clearInterval(interval)
      }
    }, [startTime, duration, onComplete])

    const formatTime = (milliseconds: number | null) => {
      if (milliseconds === null) return undefined

      const seconds = Math.floor(milliseconds / 1000)
      if (seconds === 0) return "GO!"
      return seconds.toString()
    }

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
          {formatTime(time)}
        </motion.span>
      </AnimatePresence>
    )
  }
)

export { PreStartTimer }
