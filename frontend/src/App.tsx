import { Globe } from "lucide-react"
import FriendsPanel from "./components/FriendsPanel"
import GameControls from "./components/GameControls"
import GameModeSelector from "./components/GameMode"
import GameStats from "./components/GameStats"
import WorldMap from "./components/WorldMap"
import { useGameState } from "./hooks/useGameState"

function App() {
  const {
    settings,
    setSettings,
    gameState,
    startGame,
    handleOptionsChange,
    restartGame,
    handleGuess,
    requestHint,
  } = useGameState()

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center justify-center">
            <Globe className="mr-3 text-blue-600" size={32} />
            World-Wide Wonders
          </h1>
          <p className="text-gray-600 mt-2">
            Guess as many countries as you can before the timer runs out!
          </p>
        </header>

        <div className="grid grid-cols-12 max-w-screen-2xl gap-6">
          <div className="col-span-3">
            {!gameState.gameStarted && !gameState.gameOver ? (
              <div className="flex flex-col h-full gap-4">
                <GameModeSelector
                  settings={settings}
                  setSettings={setSettings}
                  options={gameState.gameOptions}
                  onOptionsChange={handleOptionsChange}
                />
                <FriendsPanel friends={gameState.friends} />
              </div>
            ) : (
              <div>
                <FriendsPanel friends={gameState.friends} />
                <GameControls
                  onGuess={handleGuess}
                  onRequestHint={requestHint}
                  gameStarted={gameState.gameStarted}
                  gameOver={gameState.gameOver}
                  hintsUsed={gameState.hintsUsed}
                  maxHints={gameState.gameOptions.maxHints}
                  score={gameState.score}
                  totalCountries={gameState.totalCountries}
                  countries={gameState.countries}
                  currentHint={gameState.currentHint}
                />
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden col-span-6">
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
          </div>
          <div className="col-span-3">
            <GameStats
              countries={gameState.countries}
              score={gameState.score}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
