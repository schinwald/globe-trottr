"use client"

"use client"

import { Play as PlayIcon, RefreshCw as RefreshIcon } from "lucide-react"
import type React from "react"
import { useRef, useState } from "react"
import type { GlobeMethods } from "react-globe.gl"
import Globe from "react-globe.gl"
import { Button } from "@/components/ui/button"
import pointsData from "../data/world.json"

const globeImageUrl = "/world.png"

import {
  PreStartTimer,
  type PreStartTimerRef,
} from "@/app/lobby/[roomCode]/components/pre-start-timer"
import { Timer, type TimerRef } from "@/app/lobby/[roomCode]/components/timer"
import { trpc } from "@/lib/trpc"
import type { Country } from "../types"

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
  // TODO: calculate the mean instead of the average
  countryPositions[feature.properties.ADM0_A3_IS] = average
}

interface WorldMapProps {
  roomCode: string
  countries: Country[]
  timeLeft: number
  gameOver: boolean
  countdown: number | null
}

const WorldMap: React.FC<WorldMapProps> = ({
  roomCode,
  gameOver,
  countdown,
}) => {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const preStartTimerRef = useRef<PreStartTimerRef>(null)
  const timerRef = useRef<TimerRef>(null)

  const [countries, setCountries] = useState<Country[]>([])
  const [isActiveGame, setIsActiveGame] = useState(false)

  const gameStartMutation = trpc.mutationGameStart.useMutation({
    onSuccess: () => {},
  })

  // 3 second delay
  // 1 second for network latency
  // 1 second for Math.floor
  const delay = 1000 * 5
  const duration = 1000 * 60 * 5

  trpc.subscriptionGameStatuses.useSubscription(
    {
      roomCode,
    },
    {
      onData: (data) => {
        console.log(data.startedAt)
        preStartTimerRef.current?.start(data.startedAt)
        timerRef.current?.start(data.startedAt)
        setIsActiveGame(true)
      },
    }
  )

  // trpc.subscriptionGameSettings.useSubscription(
  //   {
  //     roomCode,
  //   },
  //   {}
  // )

  trpc.subscriptionUserMessages.useSubscription(
    {
      roomCode,
    },
    {
      onData: (data) => {
        if (!globeRef.current) return
        if (!data.country) return
        const [lng, lat] = countryPositions[data.country.iso]
        globeRef.current.pointOfView({ lat, lng }, 1000)
      },
    }
  )

  trpc.subscriptionGameCountryStatuses.useSubscription(
    {
      roomCode,
    },
    {
      onData: (data) => {
        setCountries(data.countries)
      },
    }
  )

  const guessedCountries = countries.filter((country) => country.guessed)
  const guessed = countries
    .filter((country) => country.guessed)
    .reduce((accumulator: Record<string, Country>, current) => {
      if (accumulator) accumulator[current.iso] = current
      return accumulator
    }, {})

  const normalizedCountryCode = (countryCode: string) => {
    if (countryCode === "GRL") return "DNK" // Greenland -> Denmark
    if (countryCode === "ESH") return "MAR" // Sahara -> Morocco
    if (countryCode === "NCL") return "FRA" // New Caledonia -> France
    if (countryCode === "PRI") return "USA" // Puerto Rico -> United States
    return countryCode
  }

  return (
    <div className="relative grid h-[500px] w-full overflow-hidden justify-center">
      {!isActiveGame && countdown === null ? (
        <div className="col-span-full row-span-full flex justify-center items-center z-30">
          <Button
            size="lg"
            onClick={() => {
              gameStartMutation.mutate({
                roomCode,
              })
            }}
          >
            <PlayIcon className="size-4 mr-1" />
            <span className="text-lg font-bold">Start Game</span>
          </Button>
        </div>
      ) : null}
      {gameOver ? (
        <div className="col-span-full row-span-full flex justify-center items-center z-30">
          <Button
            size="lg"
            onClick={() => {
              gameStartMutation.mutate({
                roomCode,
              })
            }}
          >
            <RefreshIcon className="size-4 mr-1" />
            <span className="text-lg font-bold">Play Again?</span>
          </Button>
        </div>
      ) : null}
      <div className="col-span-full row-span-full flex justify-center items-center z-20 pointer-events-none">
        <PreStartTimer
          ref={preStartTimerRef}
          className="text-6xl font-bold text-orange-300 text-shadow-lg/20"
          duration={delay}
        />
      </div>
      <div className="absolute left-0 bottom-0 p-6 z-50 text-white">
        <Timer
          ref={timerRef}
          duration={duration}
          delay={delay}
          onComplete={() => {
            setIsActiveGame(false)
          }}
        />
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
