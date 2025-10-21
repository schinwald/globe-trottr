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
    if (lastJsonMessage.type === "room-created") {
      setData((prev) => ({
        ...prev,
        roomCode: lastJsonMessage.data.roomCode,
        users: lastJsonMessage.data.users,
      }))
    } else if (lastJsonMessage.type === "user-joined") {
      setData((prev) => ({
        ...prev,
        users: lastJsonMessage.users,
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
