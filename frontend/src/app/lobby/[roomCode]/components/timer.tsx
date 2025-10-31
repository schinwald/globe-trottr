"use client"

import { Timer as TimerIcon } from "lucide-react"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { cn } from "@/lib/utils"

export type TimerRef = {
  start: (time: number) => void
  pause: () => number
  resume: (pauseDuration: number) => void
}

type TimerProps = {
  className?: string
  duration: number
  delay?: number
  onComplete?: () => void
}

const Timer = forwardRef<TimerRef, TimerProps>(
  ({ className, duration, delay = 0, onComplete }, ref) => {
    const [startTime, setStartTime] = useState<number | null>(null)
    const [isPaused, setIsPaused] = useState(true)
    const [pauseDuration, setPauseDuration] = useState(0)
    const [time, setTime] = useState<number>(duration)

    useImperativeHandle(ref, () => ({
      start: (time: number) => {
        setStartTime(time)
        setIsPaused(false)
      },
      pause: () => {
        setIsPaused(true)
        return Date.now()
      },
      resume: (pauseDuration: number) => {
        setIsPaused(false)
        setPauseDuration(pauseDuration)
      },
    }))

    useEffect(() => {
      if (startTime === null) return
      if (isPaused) return

      let interval: number | undefined
      interval = window.setInterval(() => {
        setTime(() => {
          if (startTime === null) {
            clearInterval(interval)
            return duration
          }

          const currentTime = Date.now()
          const elapsedTime = currentTime - startTime
          const activeDuration = Math.max(
            0,
            elapsedTime - pauseDuration - delay
          )
          const timeLeft = duration - activeDuration

          if (timeLeft <= 0) {
            clearInterval(interval)
            onComplete?.()
            return 0
          }

          return timeLeft
        })
      }, 1000)

      return () => {
        if (interval) clearInterval(interval)
      }
    }, [startTime, isPaused, duration, delay, pauseDuration, onComplete])

    const formatTime = (milliseconds: number) => {
      const seconds = Math.floor(milliseconds / 1000)
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs < 10 ? "0" : ""}${secs}`
    }

    return (
      <div className={cn(className, "flex items-center")}>
        <TimerIcon className="mr-1 text-blue-600" size={20} />
        <span className="text-xl font-bold">{formatTime(time)}</span>{" "}
      </div>
    )
  }
)

export { Timer }
