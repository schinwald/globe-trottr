const logoUrl = "/logo.svg"

import {
  adjectives,
  animals,
  colors,
  names,
  uniqueNamesGenerator,
} from "unique-names-generator"
import { Input } from "@/components/ui/input"
import { Link } from "@/components/ui/link"

async function App() {
  const randomNumber = Math.floor(Math.random() * 100)
  const randomUsername = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, names, colors],
    style: "capital",
    separator: "",
    length: 2,
  })
  const placeholderUsername = `${randomUsername}${randomNumber}`

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
        <div className="space-y-3">
          <Input type="text" placeholder={placeholderUsername} />
          <Link
            href="/lobby"
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create Room
          </Link>
        </div>
      </div>
    </div>
  )
}

export default App
