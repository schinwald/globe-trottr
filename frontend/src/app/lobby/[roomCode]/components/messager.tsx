"use client"

import { SendIcon } from "lucide-react"
import type React from "react"
import { useRef, useState } from "react"
import { useGuessNotification } from "@/app/lobby/[roomCode]/components/guess"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { trpc } from "@/lib/trpc"
import { useRoom } from "../hooks/room"

type GameControlsProps = {}

const Messager: React.FC<GameControlsProps> = () => {
  const { roomCode } = useRoom()
  const [guess, setGuess] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerUserGuess = useGuessNotification()

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
          autoComplete="off"
        />
        <Button
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

export { Messager }
