import { MapPinIcon, Play, RefreshCw, Timer } from "lucide-react"
import type React from "react"
import { useEffect, useRef } from "react"
import Globe from "react-globe.gl"
import { Button } from "@/components/ui/button"
import pointsData from "../data/world.json"
import globeImageUrl from "../data/world.png"
import type { Country } from "../types"

const countryPositions: Record<string, [number, number, number]> = {}
for (const feature of pointsData.features) {
  let count = 1
  const average: [number, number, number] = [0, 0, 0]
  for (const islands of feature.geometry.coordinates) {
    for (const islandCoordinates of islands) {
      for (const islandCoordinate of islandCoordinates) {
        if (typeof islandCoordinate === "number") {
          const delta: [number, number] = [
            (islandCoordinates[0] - average[0]) / count,
            (islandCoordinates[1] - average[1]) / count,
          ]
          average[0] += delta[0]
          average[1] += delta[1]
          count++
          break
        }

        const delta: [number, number] = [
          (islandCoordinate[0] - average[0]) / count,
          (islandCoordinate[1] - average[1]) / count,
        ]
        average[0] += delta[0]
        average[1] += delta[1]
        count++
      }
    }
  }
  countryPositions[feature.properties.ISO_A3] = average
}

interface WorldMapProps {
  guessedCountry: Country | null
  countries: Country[]
  score: number
  totalCountries: number
  timeLeft: number
  gameOver: boolean
  gameStarted: boolean
  onStartGame: () => void
  onRestartGame: () => void
}

const WorldMap: React.FC<WorldMapProps> = ({
  guessedCountry,
  countries,
  score,
  totalCountries,
  timeLeft,
  gameOver,
  gameStarted,
  onStartGame,
  onRestartGame,
}) => {
  const globeRef = useRef()
  const guessed = countries
    .filter((country) => country.guessed)
    .reduce((accumulator: Record<string, Country>, current) => {
      if (accumulator) accumulator[current.iso] = current
      return accumulator
    }, {})

  useEffect(() => {
    if (!guessedCountry) return
    if (!globeRef.current) return
    const [lng, lat] = countryPositions[guessedCountry.iso]
    globeRef.current.pointOfView({ lat, lng }, 1000)
  }, [guessedCountry])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="relative grid h-[500px] w-full overflow-hidden justify-center">
      <div className="absolute top-0 p-6 flex items-center">
        {guessedCountry?.name ? (
          <span className="font-bold text-green-500">
            {guessedCountry.name}
          </span>
        ) : null}
      </div>
      <div>
        {!gameStarted && !gameOver ? (
          <Button
            onClick={onStartGame}
            className="w-full py-3 px-4 flex items-center justify-center font-bold text-lg"
          >
            <Play className="mr-2" size={20} />
            Start Game
          </Button>
        ) : gameOver ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
            <p className="mb-4">
              You guessed {score} out of {totalCountries} countries.
            </p>
            <Button
              onClick={onRestartGame}
              className="py-3 px-4 flex items-center justify-center font-bold text-lg mx-auto"
            >
              <RefreshCw className="mr-2" size={20} />
              Play Again
            </Button>
          </div>
        ) : null}
      </div>
      <div className="absolute left-0 bottom-0 p-6 z-50 text-white">
        <div className="flex flex-col justify- items-start w-full">
          <div className="flex items-center">
            <Timer className="mr-1 text-blue-600" size={20} />
            <span className="text-xl font-bold">{formatTime(timeLeft)}</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="mr-1 text-red-500" size={20} />
            <span className="text-xl font-bold">
              {score} / {totalCountries}
            </span>
          </div>
        </div>
      </div>
      <div className="col-span-full row-span-full">
        <Globe
          ref={globeRef}
          height={500}
          width={2000}
          globeImageUrl={globeImageUrl}
          polygonsData={pointsData.features}
          polygonSideColor={({ properties: d }) => {
            if (guessed[d.ISO_A3]) return "#0ea271"
            if (countries.find((c) => c.name !== d.ADMIN)) {
              return `#ccc`
            }
            return "#eee"
          }}
          polygonStrokeColor={({ properties: d }) => {
            if (guessed[d.ISO_A3]) return "#0c8a60"
            if (countries.find((c) => c.name !== d.ADMIN)) {
              return `#ccc`
            }
            return "#aaa"
          }}
          polygonCapColor={({ properties: d }) => {
            if (guessed[d.ISO_A3]) return "#10b981"
            if (countries.find((c) => c.name !== d.ADMIN)) {
              return `#ccc`
            }
            return "#fff"
          }}
          polygonLabel={({ properties: d }) => {
            if (countries.find((c) => c.name === d.ADMIN)) {
              return `<b>${d.ADMIN}</b>`
            }

            return ""
          }}
          polygonAltitude={0.01}
          backgroundColor={"#1b2436"}
        />
      </div>
    </div>
  )
}

export default WorldMap
