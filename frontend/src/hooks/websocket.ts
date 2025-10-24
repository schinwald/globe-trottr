import { useEffect, useState } from "react"
import { trpc } from "../lib/trpc"

export const useRoom = () => {
  const [data, setData] = useState<{ roomCode?: string; users: string[] }>({
    users: [],
  })

  const createRoomMutation = trpc.createRoom.useMutation({
    onSuccess: (result) => {
      setData((prev) => ({
        ...prev,
        roomCode: result.roomCode,
        users: result.users,
      }))
    },
  })

  const joinRoomMutation = trpc.joinRoom.useMutation({
    onSuccess: (result) => {
      // Handle join success
    },
  })

  trpc.roomUpdates.useSubscription(
    { roomCode: data.roomCode || '' },
    {
      onData: (data) => {
        if (data.roomCode) {
          setData((prev) => ({
            ...prev,
            users: prev.users.concat(data.username),
          }))
        }
      },
      enabled: !!data.roomCode,
    }
  )

  useEffect(() => {
    createRoomMutation.mutate({ hostName: 'Host' })
  }, [])

  return {
    roomCode: data.roomCode,
    users: data.users,
    join: (userName: string) => {
      if (data.roomCode) {
        joinRoomMutation.mutate({ roomCode: data.roomCode, username: userName })
      }
    },
  }
}
