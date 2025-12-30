"use client"

import { SendIcon } from "lucide-react"
import type React from "react"
import { useRef, useState } from "react"
import { useShallow } from "zustand/shallow"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGameStore } from "../hooks/room"

type GameControlsProps = Record<string, never>

const Messager: React.FC<GameControlsProps> = () => {
  const { sendMessage } = useGameStore(
    useShallow((state) => ({
      roomCode: state.roomCode,
      sendMessage: state.sendMessage,
    }))
  )

  const [message, setMessage] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="w-full mx-auto p-6">
      <div className="flex flex-row gap-2">
        <Input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              sendMessage(message)
              setMessage("")
            }
          }}
          placeholder="Enter a country name..."
          autoComplete="off"
        />
        <Button
          onClick={() => {
            sendMessage(message)
            setMessage("")
          }}
        >
          <SendIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}

export { Messager }
