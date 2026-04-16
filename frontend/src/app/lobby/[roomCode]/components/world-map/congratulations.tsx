import { Role } from "@globe-trottr/shared/types/proto/v1/messages/room_connections_pb.js"
import { RefreshCw as RefreshIcon } from "lucide-react"
import { useShallow } from "zustand/shallow"
import { Button } from "@/components/ui/button"
import { useGameStore } from "../../hooks/room"

export const Congratulations = () => {
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
      <div className="flex flex-col items-center gap-1">
        <h3 className="text-5xl font-bold text-orange-300 text-shadow-[_0_3px_0_rgb(0,0,0,0.7)] [-webkit-text-stroke:2px_black] [paint-order:stroke_fill]">
          Congratulations!
        </h3>
        <div>
          <Button
            size="lg"
            onClick={() => {
              startGame()
            }}
          >
            <RefreshIcon className="size-4 mr-1" />
            <span className="text-lg font-bold">Play Again?</span>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <h3 className="text-5xl font-bold text-orange-300 text-shadow-[_0_3px_0_rgb(0,0,0,0.7)] [-webkit-text-stroke:2px_black] [paint-order:stroke_fill]">
        Congratulations!
      </h3>
      <div>Waiting for host to start the game...</div>
    </div>
  )
}
