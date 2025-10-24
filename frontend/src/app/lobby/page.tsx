"use client"

import { Settings, UserPlus } from "lucide-react"
import dynamic from "next/dynamic"

const WorldMap = dynamic(() => import("@/components/WorldMap"), { ssr: false })

import { useState } from "react"

const logoUrl = "/logo.svg"

import { Lobby } from "@/components/FriendsPanel"
import GameControls from "@/components/GameControls"
import GameModeModal from "@/components/GameModeModal"
import GameStats from "@/components/GameStats"
import { Button } from "@/components/ui/button"
import { useGameState } from "@/hooks/useGameState"
import { useRoom } from "@/hooks/websocket"

function App() {
  const [isModalOpen, setIsModalOpen] = useState(true)
  const {
    settings,
    setSettings,
    gameState,
    startGame,
    handleOptionsChange,
    restartGame,
    handleGuess,
  } = useGameState()
  const { roomCode, users, join } = useRoom()

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="grid grid-cols-12 auto-rows-auto max-w-screen-2xl gap-6">
        <div className="col-span-3 flex justify-start items-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            <UserPlus className="size-4" />
            Invite Friends
          </Button>
        </div>
        <header className="col-span-6 flex flex-col items-center">
          <div className="size-[200px] -mt-[25px] -mb-[100px] -mx-[100px]">
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
            <Settings className="size-4" />
          </Button>
        </div>
        <div className="col-span-3 h-[650px]">
          <div className="flex flex-col h-full gap-4">
            <Lobby
              friends={gameState.friends}
              roomCode={roomCode}
              users={users}
              onJoin={join}
            />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden col-span-6 h-[650px]">
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
          />
          <GameControls
            onGuess={handleGuess}
            gameStarted={gameState.gameStarted}
            gameOver={gameState.gameOver}
            countries={gameState.countries}
          />
        </div>
        <div className="col-span-3 h-[650px]">
          <GameStats countries={gameState.countries} score={gameState.score} />
        </div>
      </div>

      <GameModeModal
        isOpen={isModalOpen}
        settings={settings}
        setSettings={setSettings}
        options={gameState.gameOptions}
        onOptionsChange={handleOptionsChange}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default App

