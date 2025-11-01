const logoUrl = "/logo.svg"

import { server } from "@/trpc"
import type { User } from "../../../../backend/src/utils/redis-schema"
import { CreateRoom } from "./components/create-room"
import { getRandomUsername } from "./server/placeholder"

async function App() {
  const user = (await server.queryUser.query()) as unknown as User
  const placeholderUsername = await getRandomUsername()

  return (
    <div className="w-full h-screen flex justify-center items-center px-4">
      <div className="-mt-20 sm:m-0 max-w-md w-full bg-white rounded-xl border border-gray-300 shadow-xl p-8 text-center flex flex-col gap-3 overflow-hidden">
        <div className="size-[260px] sm:size-[320px] md:size-[400px] mx-auto -my-[60px] sm:-my-[80px] md:-my-[100px] pointer-events-none">
          <img
            src={logoUrl}
            alt="Globe Trotters Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-gray-600">
          Test your geography knowledge! Guess as many countries as you can
          before the timer runs out.
        </p>
        <CreateRoom user={user} placeholderUsername={placeholderUsername} />
      </div>
    </div>
  )
}

export default App
