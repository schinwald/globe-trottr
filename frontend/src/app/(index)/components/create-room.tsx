"use client"

import type { User } from "@globe-trottr/shared/types/proto/v1/messages/room_connections_pb.js"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { trpc } from "@/lib/trpc"

type CreateRoomProps = {
  user?: User
  placeholderUsername: string
}

export const CreateRoom: React.FC<CreateRoomProps> = ({
  user,
  placeholderUsername,
}) => {
  const [username, setUsername] = useState(user?.username ?? "")
  const [isRedirecting, setIsRedirecting] = useState(false)

  const searchParams = useSearchParams()
  const roomCode = searchParams.get("roomCode")

  const authenticateMutation = trpc.mutationUserAuthenticate.useMutation({
    onSuccess: () => {
      if (roomCode) {
        redirectToLobby(roomCode)
        return
      }

      createRoomMutation.mutate()
    },
  })

  const redirectToLobby = (roomCode: string) => {
    setIsRedirecting(true)
    window.location.href = `/lobby/${roomCode}`
  }

  const createRoomMutation = trpc.mutationRoomCreate.useMutation({
    onSuccess: ({ roomCode }) => {
      redirectToLobby(roomCode)
    },
  })

  const getRoomMessage = () => {
    if (authenticateMutation.isPending) return "Creating User..."
    if (createRoomMutation.isPending) return "Creating Room..."
    if (isRedirecting) return "Creating Room..."
    return "Create Room"
  }

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
            authenticateMutation.mutate({
              username: username || placeholderUsername,
            })
          }}
        >
          Join Room
        </Button>
      ) : (
        <Button
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => {
            authenticateMutation.mutate({
              username: username || placeholderUsername,
            })
          }}
        >
          {getRoomMessage()}
        </Button>
      )}
    </div>
  )
}
