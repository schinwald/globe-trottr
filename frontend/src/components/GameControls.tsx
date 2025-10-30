"use client"

import { SendIcon } from "lucide-react"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useGuessNotification } from "@/app/lobby/[roomCode]/components/guess"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { trpc } from "@/lib/trpc"
import type { Country } from "../types"

interface GameControlsProps {
  roomCode: string
  gameStarted: boolean
  gameOver: boolean
  countries: Country[]
}

const GameControls: React.FC<GameControlsProps> = ({
  roomCode,
  gameStarted,
  gameOver,
}) => {
  const [guess, setGuess] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerUserGuess = useGuessNotification()

  useEffect(() => {
    if (gameStarted && !gameOver && inputRef.current) {
      inputRef.current.focus()
    }
  }, [gameStarted, gameOver])

  const userMessageMutation = trpc.mutationUserMessage.useMutation({
    onMutate: () => {
      setGuess("")
    },
  })

  trpc.subscriptionUserMessages.useSubscription(
    {
      roomCode,
    },
    {
      onData: (data) => {
        triggerUserGuess({ userId: data.userId, guess: data.guess })
      },
      enabled: gameStarted && !gameOver,
    }
  )

  return (
    <div className="w-full mx-auto p-6">
      <div className="flex flex-row gap-2">
        <Input
          ref={inputRef}
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              userMessageMutation.mutate({ roomCode, guess })
            }
          }}
          placeholder="Enter a country name..."
          disabled={gameOver}
          autoComplete="off"
        />
        <Button
          disabled={gameOver}
          onClick={() => {
            return userMessageMutation.mutate({ roomCode, guess })
          }}
        >
          <SendIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export default GameControls
