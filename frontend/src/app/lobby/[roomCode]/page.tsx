import { redirect } from "next/navigation"
import { server } from "@/trpc"
import { Game } from "./components/game"

type Params = {
  params: {
    roomCode: string
  }
}

async function App({ params }: Params) {
  const getRoom = async () => {
    try {
      return await server.queryRoom.query({ roomCode: params.roomCode })
    } catch {
      redirect("/")
    }
  }

  await getRoom()

  return (
    <div className="min-h-screen py-8 px-8">
      <Game />
    </div>
  )
}

export default App
