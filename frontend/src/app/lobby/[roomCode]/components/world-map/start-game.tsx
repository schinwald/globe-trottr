import { Role } from "@globe-trottr/shared/types/proto/v1/messages/room_connections_pb.js"
import { Play as PlayIcon } from "lucide-react"
import { useShallow } from "zustand/shallow"
import { Button } from "@/components/ui/button"
import { useGameStore } from "../../hooks/room"

export const StartGame = () => {
  const { me, users, startGame } = useGameStore(
    useShallow((store) => ({
      me: store.me,
      users: store.users,
      startGame: store.startGame,
    }))
  )

  const user = users.find((user) => user.id === me.id)

  if (user?.role === Role.HOST) {
    return (
      <Button
        size="lg"
        onClick={() => {
          startGame()
        }}
      >
        <PlayIcon className="size-4 mr-1" />
        <span className="text-lg font-bold">Start Game</span>
      </Button>
    )
  }

  return <div>Waiting for host to start the game...</div>
}
