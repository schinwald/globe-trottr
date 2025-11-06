"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Play as PlayIcon, RefreshCw as RefreshIcon } from "lucide-react"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import Confetti from "react-confetti"
import type { GlobeMethods } from "react-globe.gl"
import Globe from "react-globe.gl"
import {
  PreStartTimer,
  type PreStartTimerRef,
} from "@/app/lobby/[roomCode]/components/pre-start-timer"
import { Timer, type TimerRef } from "@/app/lobby/[roomCode]/components/timer"
import { Button } from "@/components/ui/button"
import pointsData from "@/data/world.json"
import { trpc } from "@/lib/trpc"
import type { Country } from "@/types"
import { useRoom } from "../hooks/room"
import { useSettings } from "../hooks/settings"

const mapColor = {
  fill: "#6ABD45",
  border: "#0c8a60",
  depth: "#0ea271",
}

const globeImageUrl = "/world.png"

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

type WorldMapProps = {}

const WorldMap: React.FC<WorldMapProps> = () => {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const preStartTimerRef = useRef<PreStartTimerRef>(null)
  const timerRef = useRef<TimerRef>(null)

  const { roomCode } = useRoom()
  const [countries, setCountries] = useState<Country[]>([])
  const { delay, duration } = useSettings()
  const [gameState, setGameState] = useState<
    "default" | "counting-down" | "in-progress" | "time-up" | "won"
  >("default")

  const gameStartMutation = trpc.mutationGameStart.useMutation()

  trpc.subscriptionGameStatuses.useSubscription(
    {
      roomCode,
    },
    {
      onData: (data) => {
        if (!data.startedAt) return
        preStartTimerRef.current?.start(data.startedAt)
        timerRef.current?.start(data.startedAt)
        setGameState("counting-down")
      },
    }
  )

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
        const guessedCountries = data.countries.filter(
          (country) => country.guessed
        )

        if (guessedCountries.length === data.countries.length) {
          setGameState("won")
          timerRef.current?.stop()
        }
      },
    }
  )

  useEffect(() => {
    if (!globeRef.current) return

    const lights = globeRef.current.lights()
    const [ambientLight, directionalLight] = lights

    ambientLight.color.r = 1
    ambientLight.color.g = 1
    ambientLight.color.b = 1

    directionalLight.visible = false
  }, [])

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
      {gameState === "default" ? (
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
      {gameState === "time-up" ? (
        <div className="col-span-full row-span-full flex justify-center items-center z-30">
          <div className="flex flex-col items-center gap-1">
            <h3 className="text-5xl font-bold text-orange-300 text-shadow-[_0_3px_0_rgb(0,0,0,0.7)] [-webkit-text-stroke:2px_black] [paint-order:stroke_fill]">
              Times Up!
            </h3>
            <div>
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
          </div>
        </div>
      ) : null}
      {gameState === "won" ? (
        <div className="col-span-full row-span-full flex justify-center items-center z-30">
          <div className="flex flex-col items-center gap-1">
            <h3 className="text-5xl font-bold text-orange-300 text-shadow-[_0_3px_0_rgb(0,0,0,0.7)] [-webkit-text-stroke:2px_black] [paint-order:stroke_fill]">
              Congratulations!
            </h3>
            <div>
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
          </div>
        </div>
      ) : null}
      <div className="col-span-full row-span-full flex justify-center items-center z-30 pointer-events-none">
        <PreStartTimer
          ref={preStartTimerRef}
          className="text-6xl font-bold text-orange-300 text-shadow-[_0_3px_0_rgb(0,0,0,0.7)] [-webkit-text-stroke:1px_black]"
          duration={delay}
          onComplete={() => {
            setGameState("in-progress")
          }}
        />
      </div>
      <AnimatePresence>
        {gameState === "won" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="col-span-full row-span-full flex justify-center items-center z-20 pointer-events-none"
          >
            <Confetti
              width={2000}
              height={500}
              initialVelocityY={-10}
              numberOfPieces={300}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="absolute left-0 bottom-0 p-6 z-50 text-white">
        <Timer
          ref={timerRef}
          duration={duration}
          delay={delay}
          onComplete={() => {
            setGameState("time-up")
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
            if (guessed[normalizedCountryCode(d.ADM0_A3_IS)])
              return mapColor.depth

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
            if (guessed[normalizedCountryCode(d.ADM0_A3_IS)])
              return mapColor.border

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
            if (guessed[normalizedCountryCode(d.ADM0_A3_IS)])
              return mapColor.fill

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

export { WorldMap }
