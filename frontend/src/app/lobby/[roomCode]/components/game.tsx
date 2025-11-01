"use client"

import { UsersIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { LobbyPanel } from "@/app/lobby/[roomCode]/components/lobby-panel"
import ErrorModal from "@/components/ErrorModal"
import { Button } from "@/components/ui/button"
import { useGameState } from "@/hooks/useGameState"
import { trpc } from "@/lib/trpc"
import type { ErrorType } from "@/utils/errors"
import type { User } from "../../../../../../backend/src/utils/redis-schema"
import { Settings } from "../hooks/settings"
import { CountryPanel } from "./country-panel"
import { Guess } from "./guess"
import { Messager } from "./messager"
import { WorldMap } from "./world-map"

const logoUrl = "/logo.svg"

interface GameProps {
  roomCode: string
}

const Game: React.FC<GameProps> = ({ roomCode }) => {
  const { gameState, countdown } = useGameState()

  const [users, setUsers] = useState<
    (User & { id: string; role: "host" | "guest" })[]
  >([])
  const [error, setError] = useState<ErrorType>()

  trpc.subscriptionRoomConnections.useSubscription(
    {
      roomCode,
    },
    {
      onData: ({ users }) => {
        setUsers(users)
      },
      onError: (error) => {
        if (error.data?.code === "NOT_FOUND") {
          window.location.href = "/"
          // setError({
          //   title: "Uncharted Territory!",
          //   message: "No room found on this corner of the map.",
          // })
        }
      },
      onComplete: () => {
        // setError({
        //   title: "Looks like you've fallen of the grid!",
        //   message: "Attempting to reconnect...",
        // })
      },
    }
  )

  return (
    <Settings.Provider
      maxPlayers={6}
      delay={1000 * 5}
      defaultDuration={1000 * 60 * 5}
    >
      <Guess.Provider>
        <div className="grid grid-cols-12 auto-rows-auto max-w-screen-2xl gap-4">
          <div className="col-span-3 sm:hidden flex items-end">
            <Button variant="ghost">
              <UsersIcon className="size-5 text-blue-600" />
              Lobby
            </Button>
          </div>
          <header className="col-span-6 sm:col-span-full flex flex-col items-center justify-end">
            <div className="size-[199px] -mt-[25px] -mb-[80px] -mx-[100px]">
              <Link href="/">
                <img src={logoUrl} alt="Logo" className="w-full" />
              </Link>
            </div>
          </header>
          <div className="col-span-3 sm:hidden flex flex-col justify-end"></div>
          <div className="hidden sm:block sm:col-span-4 md:col-span-3 h-[590px]">
            <LobbyPanel roomCode={roomCode} users={users} />
          </div>
          <div className="bg-white rounded-xl shadow-xl border border-gray-300 overflow-hidden col-span-12 sm:col-span-8 md:col-span-6 h-[590px]">
            <WorldMap
              roomCode={roomCode}
              countries={gameState.countries}
              timeLeft={gameState.timeLeft}
              gameOver={gameState.gameOver}
              countdown={countdown}
            />
            <Messager
              roomCode={roomCode}
              gameStarted={gameState.gameStarted}
              gameOver={gameState.gameOver}
              countries={gameState.countries}
            />
          </div>
          <div className="col-span-3 hidden md:block h-[590px]">
            <CountryPanel roomCode={roomCode} />
          </div>
          <ErrorModal
            isOpen={Boolean(error)}
            error={error}
            onClose={() => setError(undefined)}
          />
        </div>
      </Guess.Provider>
    </Settings.Provider>
  )
}

export { Game }
