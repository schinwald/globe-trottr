const bigLogoURL = "/big-logo.svg"

import { server } from "@/trpc"
import { CreateRoom } from "./components/create-room"
import { getRandomUsername } from "./server/placeholder"

async function App() {
  const me = await server.queryMe.query()
  const placeholderUsername = await getRandomUsername()

  return (
    <div className="w-full h-screen flex justify-center items-center px-4">
      <div className="-mt-20 sm:m-0 max-w-md w-full bg-white rounded-xl border border-gray-300 shadow-xl px-8 py-10 text-center flex flex-col gap-6">
        <img
          src={bigLogoURL}
          alt="Globe Trotters Logo"
          className="w-full h-[200px] -mt-[150px] object-contain"
        />
        <div className="flex flex-col gap-3">
          <p className="text-gray-600">
            Test your geography knowledge! Guess as many countries as you can
            before the timer runs out.
          </p>
          <CreateRoom me={me} placeholderUsername={placeholderUsername} />
        </div>
      </div>
    </div>
  )
}

export default App
