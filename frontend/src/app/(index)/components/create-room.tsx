"use client"

import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import {
  adjectives,
  animals,
  colors,
  names,
  uniqueNamesGenerator,
} from "unique-names-generator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { trpc } from "@/lib/trpc"

export default function CreateRoom() {
  const randomNumber = Math.floor(Math.random() * 100)
  const randomUsername = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, names, colors],
    style: "capital",
    separator: "",
    length: 2,
  })
  const placeholderUsername = `${randomUsername}${randomNumber}`

  const [username, setUsername] = useState("")

  const searchParams = useSearchParams()
  const roomCode = searchParams.get("invite")

  const loadUserName = useCallback(() => {
    const username = window.sessionStorage.getItem("username")
    if (username) {
      setUsername(username)
    }
  }, [])

  const saveUsername = () => {
    window.sessionStorage.setItem("username", username || placeholderUsername)
  }

  const redirectToLobby = (roomCode: string) => {
    window.location.href = `/lobby/${roomCode}`
  }

  const createRoomMutation = trpc.mutationRoomCreate.useMutation({
    onSuccess: ({ roomCode }) => {
      saveUsername()
      redirectToLobby(roomCode)
    },
  })

  useEffect(() => {
    loadUserName()
  }, [loadUserName])

  return (
    <div className="space-y-3">
      <Input
        type="text"
        placeholder={placeholderUsername}
        value={username}
        onInput={(e) => setUsername(e.currentTarget.value)}
      />
      {roomCode ? (
        <Button
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => {
            saveUsername()
            redirectToLobby(roomCode)
          }}
        >
          Join Room
        </Button>
      ) : (
        <Button
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => {
            createRoomMutation.mutate()
          }}
        >
          Create Room
        </Button>
      )}
    </div>
  )
}
