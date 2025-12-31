import { redirect } from "next/navigation"
import { server } from "@/trpc"
import { Main } from "./components/game"

type Params = {
  params: {
    roomCode: string
  }
}

async function App({ params }: Params) {
  const [me, room] = await Promise.all([
    server.queryMe.query(),
    server.queryRoom.query({ roomCode: params.roomCode }),
  ])

  if (!me) redirect("/")
  if (!room) redirect("/")

  return (
    <div className="min-h-screen py-8 px-2 sm:px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Main me={me} room={room} />
      </div>
    </div>
  )
}

export default App
