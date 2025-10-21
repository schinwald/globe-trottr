import { useEffect, useState } from "react"
import useWebSocket from "react-use-websocket"

export const useRoom = () => {
  const [data, setData] = useState<{ roomCode?: string; users: string[] }>({
    users: [],
  })
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(
    "ws://localhost:5000/websocket"
  )

  useEffect(() => {
    if (!lastJsonMessage) return
    const msg = lastJsonMessage as any
    if (msg.type === "room-created") {
      setData((prev) => ({
        ...prev,
        roomCode: msg.data.roomCode,
        users: msg.data.users,
      }))
    } else if (msg.type === "user-joined") {
      setData((prev) => ({
        ...prev,
        users: msg.data.users,
      }))
    }
  }, [lastJsonMessage])

  return {
    roomCode: data.roomCode,
    users: data.users,
    join: (roomCode: string, user: { name: string }) => {
      sendJsonMessage({ intent: "join-room", data: { roomCode, user } })
    },
    leave: () => {},
  }
}
