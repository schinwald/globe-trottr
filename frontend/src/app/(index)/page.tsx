const logoUrl = "/logo.svg"

import CreateRoom from "./components/create-room"

async function App() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="max-w-md bg-white rounded-xl border border-gray-300 shadow-xl p-8 text-center">
        <div className="size-[400px] mx-auto -my-[100px] pointer-events-none">
          <img
            src={logoUrl}
            alt="Globe Trotters Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Test your geography knowledge! Guess as many countries as you can
          before the timer runs out.
        </p>
        <CreateRoom />
      </div>
    </div>
  )
}

export default App
