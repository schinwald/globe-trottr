"use client"

import { Settings, UserPlus } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import ErrorModal from "@/components/ErrorModal"
import { Lobby } from "@/components/FriendsPanel"
import { Floater } from "@/components/floater"
import GameControls from "@/components/GameControls"
import GameModeModal from "@/components/GameModeModal"
import GameStats from "@/components/GameStats"
import { Button } from "@/components/ui/button"
import WorldMap from "@/components/WorldMap"
import { useGameState } from "@/hooks/useGameState"
import { trpc } from "@/lib/trpc"
import type { ErrorType } from "@/utils/errors"
import type { User } from "../../../../../../backend/src/utils/redis-schema"

const logoUrl = "/logo.svg"

type Params = { roomCode: string }

const Game: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {
    settings,
    setSettings,
    gameState,
    startGame,
    handleOptionsChange,
    restartGame,
    handleGuess,
    countdown,
  } = useGameState()

  const { roomCode } = useParams<Params>()
  const [users, setUsers] = useState<(User & { id: string })[]>([])
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

  trpc.subscriptionCountryGuesses.useSubscription(
    {
      roomCode,
      userId: window.sessionStorage.getItem("username") ?? "",
    },
    {
      onData: ({ userId, guess }) => {
        console.log(userId, guess)
      },
    }
  )

  return (
    <div className="grid grid-cols-12 auto-rows-auto max-w-screen-2xl gap-4">
      <div className="col-span-3 flex justify-start items-end">
        <Floater.Root>
          <Floater.Trigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(
                  `localhost:3000/lobby/${roomCode}`
                )
              }}
            >
              <UserPlus className="size-5" />
              Invite Friends
            </Button>
          </Floater.Trigger>
          <Floater.Portal>
            <p className="text-sm whitespace-nowrap text-primary">Copied!</p>
          </Floater.Portal>
        </Floater.Root>
      </div>
      <header className="col-span-6 flex flex-col items-center">
        <div className="size-[199px] -mt-[25px] -mb-[100px] -mx-[100px]">
          <img src={logoUrl} alt="Logo" className="w-full" />
        </div>
      </header>
      <div className="col-span-3 flex justify-end items-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsModalOpen(true)}
        >
          Settings
          <Settings className="size-5" />
        </Button>
      </div>
      <div className="col-span-3 h-[590px]">
        <div className="flex flex-col h-full gap-5">
          <Lobby users={users} />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-xl border border-gray-300 overflow-hidden col-span-6 h-[590px]">
        <WorldMap
          guessedCountry={gameState.guessedCountry}
          countries={gameState.countries}
          score={gameState.score}
          totalCountries={gameState.totalCountries}
          timeLeft={gameState.timeLeft}
          gameStarted={gameState.gameStarted}
          gameOver={gameState.gameOver}
          onStartGame={startGame}
          onRestartGame={restartGame}
          countdown={countdown}
        />
        <GameControls
          onGuess={handleGuess}
          gameStarted={gameState.gameStarted}
          gameOver={gameState.gameOver}
          countries={gameState.countries}
        />
      </div>
      <div className="col-span-3 h-[590px]">
        <GameStats countries={gameState.countries} score={gameState.score} />
      </div>
      <GameModeModal
        isOpen={isModalOpen}
        settings={settings}
        setSettings={setSettings}
        options={gameState.gameOptions}
        onOptionsChange={handleOptionsChange}
        onClose={() => setIsModalOpen(false)}
      />
      <ErrorModal
        isOpen={Boolean(error)}
        error={error}
        onClose={() => setError(undefined)}
      />
    </div>
  )
}

export { Game }
