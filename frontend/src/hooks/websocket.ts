import { useEffect, useState } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"

export const useRoom = () => {
  const [data, setData] = useState<Record<string, any>>({})
  const { sendJsonMessage, readyState, lastJsonMessage } = useWebSocket(
    "ws://localhost:5000/websocket"
  )

  useEffect(() => {
    setData((prev) => ({
      roomCode: prev.roomCode ?? lastJsonMessage?.data?.roomCode,
    }))
  }, [lastJsonMessage])

  return {
    roomCode: data.roomCode,
    users: [],
    join: (roomCode: string, user: { name: string }) => {
      sendJsonMessage({ intent: "join-room", data: { roomCode, user } })
    },
    leave: () => {},
  }
}
