"use client"

import { Map as MapIcon, UsersIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { LobbyPanel } from "@/app/lobby/[roomCode]/components/lobby-panel"
import ErrorModal from "@/components/ErrorModal"
import { Button } from "@/components/ui/button"
import type { ErrorType } from "@/utils/errors"
import type { Room } from "../../../../../../backend/src/utils/redis/models/rooms/types"
import type { User } from "../../../../../../backend/src/utils/redis/models/users/types"
import { Game } from "../hooks/room"
import { CountryPanel } from "./country-panel"
import { Messager } from "./messager"
import { WorldMap } from "./world-map"

const smallLogoURl = "/small-logo.svg"
const bigLogoURL = "/big-logo.svg"

interface GameProps {
  me: User
  room: Room
  qrcodeDataURL: string
}

const Main: React.FC<GameProps> = ({ me, room, qrcodeDataURL }) => {
  const [error, setError] = useState<ErrorType>()

  // setError({
  //   title: "Uncharted Territory!",
  //   message: "No room found on this corner of the map.",
  // })

  // setError({
  //   title: "Looks like you've fallen of the grid!",
  //   message: "Attempting to reconnect...",
  // })

  return (
    <Game.Provider
      me={me}
      roomCode={room.roomCode}
      qrcodeDataURL={qrcodeDataURL}
    >
      <div className="grid grid-cols-12 auto-rows-auto max-w-screen-2xl gap-4">
        <div className="col-span-3 sm:hidden flex justify-start items-end">
          <Button variant="ghost" size="xs">
            <div className="flex gap-1 items-center hover:scale-[102%] transition-transform">
              <UsersIcon className="size-5 text-blue-600" />
              Lobby
            </div>
          </Button>
        </div>
        <header className="col-span-6 sm:col-span-full flex justify-center sm:justify-start">
          <Link href="/">
            <img
              src={smallLogoURl}
              alt="Logo"
              className="hidden sm:block h-20"
            />
            <img src={bigLogoURL} alt="Logo" className="block sm:hidden h-20" />
          </Link>
        </header>
        <div className="col-span-3 sm:hidden flex justify-end items-end">
          <Button variant="ghost" size="xs">
            <div className="flex gap-1 items-center hover:scale-[102%] transition-transform">
              Countries
              <MapIcon className="size-5 text-blue-600" />
            </div>
          </Button>
        </div>
        <div className="hidden sm:block sm:col-span-4 md:col-span-3 h-[590px]">
          <LobbyPanel />
        </div>
        <div className="bg-white rounded-xl shadow-xl border border-gray-300 overflow-hidden col-span-12 sm:col-span-8 md:col-span-6 h-[590px]">
          <WorldMap />
          <Messager />
        </div>
        <div className="col-span-3 hidden md:block h-[590px]">
          <CountryPanel />
        </div>
        <ErrorModal
          isOpen={Boolean(error)}
          error={error}
          onClose={() => setError(undefined)}
        />
      </div>
    </Game.Provider>
  )
}

export { Main }
