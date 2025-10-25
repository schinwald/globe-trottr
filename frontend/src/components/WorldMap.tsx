import { MapPinIcon, Play, RefreshCw, Timer } from "lucide-react"
import type React from "react"
import { useEffect, useRef } from "react"
import Globe, { type GlobeMethods } from "react-globe.gl"
import { Button } from "@/components/ui/button"
import pointsData from "../data/world.json"

const globeImageUrl = "/world.png"

import type { Country } from "../types"
import { AnimateCountdown } from "./AnimateCountdown"

const countryPositions: Record<string, [number, number, number]> = {}

for (const feature of pointsData.features) {
  let count = 1
  const average: [number, number, number] = [0, 0, 0]
  for (const islands of feature.geometry.coordinates) {
    for (const islandCoordinates of islands) {
      for (const islandCoordinate of islandCoordinates) {
        if (typeof islandCoordinate === "number") {
          const coords = islandCoordinates as [number, number]
          const delta: [number, number] = [
            (coords[0] - average[0]) / count,
            (coords[1] - average[1]) / count,
          ]
          average[0] += delta[0]
          average[1] += delta[1]
          count++
          break
        }

        const coord = islandCoordinate as [number, number]
        const delta: [number, number] = [
          (coord[0] - average[0]) / count,
          (coord[1] - average[1]) / count,
        ]
        average[0] += delta[0]
        average[1] += delta[1]
        count++
      }
    }
  }
  countryPositions[feature.properties.ADM0_A3_IS] = average
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
  countdown: number | null
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
  countdown,
}) => {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
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

  const getCountdown = () => {
    if (countdown === null) return undefined
    if (countdown === 0) return "GO!"
    return countdown.toString()
  }

  const guessedCountries = countries.filter((country) => country.guessed)

  const normalizedCountryCode = (countryCode: string) => {
    if (countryCode === "GRL") return "DNK" // Greenland -> Denmark
    if (countryCode === "ESH") return "MAR" // Sahara -> Morocco
    if (countryCode === "NCL") return "FRA" // New Caledonia -> France
    if (countryCode === "PRI") return "USA" // Puerto Rico -> United States
    return countryCode
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
      {!gameStarted && !gameOver && countdown === null ? (
        <div className="col-span-full row-span-full flex justify-center items-center z-30">
          <Button size="lg" onClick={onStartGame}>
            <Play className="size-4 mr-1" />
            <span className="text-lg font-bold">Start Game</span>
          </Button>
        </div>
      ) : null}
      <div className="col-span-full row-span-full flex justify-center items-center z-20 pointer-events-none">
        <AnimateCountdown
          value={getCountdown()}
          className="text-6xl font-bold text-orange-300 text-shadow-lg/20"
        />
      </div>
      {gameOver ? (
        <div className="col-span-full row-span-full flex justify-center items-center z-30">
          <Button onClick={onRestartGame} size="lg">
            <RefreshCw className="size-4 mr-2" />
            <span className="text-lg font-bold">Play Again?</span>
          </Button>
        </div>
      ) : null}
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
          polygonSideColor={({ properties: d }: any) => {
            if (guessed[normalizedCountryCode(d.ADM0_A3_IS)]) return "#0ea271"

            if (
              !countries.find(
                (c) => c.iso === normalizedCountryCode(d.ADM0_A3_IS)
              )
            ) {
              return `#ccc`
            }

            return "#eee"
          }}
          polygonStrokeColor={({ properties: d }: any) => {
            if (guessed[normalizedCountryCode(d.ADM0_A3_IS)]) return "#0c8a60"

            if (
              !countries.find(
                (c) => c.iso === normalizedCountryCode(d.ADM0_A3_IS)
              )
            ) {
              return `#ccc`
            }

            return "#aaa"
          }}
          polygonCapColor={({ properties: d }: any) => {
            if (guessed[normalizedCountryCode(d.ADM0_A3_IS)]) return "#10b981"

            if (
              !countries.find(
                (c) => c.iso === normalizedCountryCode(d.ADM0_A3_IS)
              )
            ) {
              return `#ccc`
            }

            return "#fff"
          }}
          polygonLabel={({ properties: d }: any) => {
            if (
              guessedCountries.find(
                (c) => c.iso === normalizedCountryCode(d.ADM0_A3_IS)
              )
            ) {
              return `<b>${d.NAME}</b>`
            }

            if (!countries.find((c) => c.iso === d.ADM0_A3_IS)) {
              return `<b>${d.NAME}</b>`
            }

            return "???"
          }}
          polygonAltitude={0.01}
          backgroundColor={"#1b2436"}
        />
      </div>
    </div>
  )
}

export default WorldMap
