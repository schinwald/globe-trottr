import { redirect } from "next/navigation"
import QRCode from "qrcode"
import { server } from "@/trpc"
import { getURL, redirectToHomepage } from "@/utils/server/redirects"
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

  const url = getURL()

  if (!room) redirect(redirectToHomepage())
  if (!me) redirect(redirectToHomepage(room.roomCode))
  if (!url) redirect(redirectToHomepage(room.roomCode))

  const qrcodeDataURL = await QRCode.toDataURL(url)

  return (
    <div className="min-h-screen py-8 px-2 sm:px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Main me={me} room={room} qrcodeDataURL={qrcodeDataURL} />
      </div>
    </div>
  )
}

export default App
