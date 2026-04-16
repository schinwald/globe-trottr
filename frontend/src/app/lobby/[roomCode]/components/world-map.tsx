"use client"

import type { Country } from "@globe-trottr/shared/utils/countries.js"
import { AnimatePresence, motion } from "framer-motion"
import type React from "react"
import { useEffect, useRef } from "react"
import Confetti from "react-confetti"
import type { GlobeMethods } from "react-globe.gl"
import Globe from "react-globe.gl"
import { useShallow } from "zustand/shallow"
import pointsData from "@/data/world.json"
import { useGameStore } from "../hooks/room"
import { Feedback } from "./feedback"
import { Congratulations } from "./world-map/congratulations"
import { PostStartCountdown } from "./world-map/poststart-countdown"
import { PreStartCountdown } from "./world-map/prestart-countdown"
import { StartGame } from "./world-map/start-game"
import { TimesUp } from "./world-map/times-up"

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

type WorldMapProps = Record<string, never>

const WorldMap: React.FC<WorldMapProps> = () => {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const { state, countriesFound, countriesTotal } = useGameStore(
    useShallow((store) => ({
      state: store.state,
      countriesFound: store.countriesFound,
      countriesTotal: store.countriesTotal,
    }))
  )

  useEffect(() => {
    if (!globeRef.current) return
    const country = countriesFound[0]
    if (!country) return
    const position = countryPositions[country.iso]
    if (!position) return
    const [lng, lat] = position
    globeRef.current.pointOfView({ lat, lng }, 1000)
  }, [countriesFound])

  useEffect(() => {
    if (!globeRef.current) return

    const lights = globeRef.current.lights()
    const [ambientLight, directionalLight] = lights

    ambientLight.color.r = 1
    ambientLight.color.g = 1
    ambientLight.color.b = 1

    directionalLight.visible = false
  }, [])

  const countriesFoundByISO = countriesFound.reduce(
    (accumulator: Record<string, Country>, current) => {
      if (accumulator) accumulator[current.iso] = current as Country
      return accumulator
    },
    {}
  )

  const normalizedCountryCode = (countryCode: string) => {
    if (countryCode === "GRL") return "DNK" // Greenland -> Denmark
    if (countryCode === "ESH") return "MAR" // Sahara -> Morocco
    if (countryCode === "NCL") return "FRA" // New Caledonia -> France
    if (countryCode === "PRI") return "USA" // Puerto Rico -> United States
    return countryCode
  }

  return (
    <div className="relative grid h-[500px] w-full overflow-hidden justify-center">
      {state === "default" ? (
        <div className="col-span-full row-span-full flex justify-center items-center z-30">
          <StartGame />
        </div>
      ) : null}
      {state === "timed-out" ? (
        <div className="col-span-full row-span-full flex justify-center items-center z-30">
          <TimesUp />
        </div>
      ) : null}
      {state === "won" ? (
        <div className="col-span-full row-span-full flex justify-center items-center z-30">
          <Congratulations />
        </div>
      ) : null}
      <div className="col-span-full row-span-full flex justify-center items-center z-30 pointer-events-none">
        <PreStartCountdown className="text-6xl font-bold text-orange-300 text-shadow-[_0_3px_0_rgb(0,0,0,0.7)] [-webkit-text-stroke:1px_black]" />
      </div>
      <AnimatePresence>
        {state === "won" ? (
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
      <div className="absolute right-0 top-0 p-6 z-50 text-white">
        <PostStartCountdown />
      </div>
      <div className="absolute w-full bottom-0 p-6 z-50 text-white">
        <div className="flex justify-center w-full">
          <Feedback />
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
            if (countriesFoundByISO[normalizedCountryCode(d.ADM0_A3_IS)])
              return mapColor.depth

            if (
              !countriesTotal.find(
                (c) => c.iso === normalizedCountryCode(d.ADM0_A3_IS)
              )
            ) {
              return `#ccc`
            }

            return "#eee"
          }}
          polygonStrokeColor={({ properties: d }: any) => {
            if (countriesFoundByISO[normalizedCountryCode(d.ADM0_A3_IS)])
              return mapColor.border

            if (
              !countriesTotal.find(
                (c) => c.iso === normalizedCountryCode(d.ADM0_A3_IS)
              )
            ) {
              return `#ccc`
            }

            return "#aaa"
          }}
          polygonCapColor={({ properties: d }: any) => {
            if (countriesFoundByISO[normalizedCountryCode(d.ADM0_A3_IS)])
              return mapColor.fill

            if (
              !countriesTotal.find(
                (c) => c.iso === normalizedCountryCode(d.ADM0_A3_IS)
              )
            ) {
              return `#ccc`
            }

            return "#fff"
          }}
          polygonLabel={({ properties: d }: any) => {
            if (
              countriesFound.find(
                (c) => c.iso === normalizedCountryCode(d.ADM0_A3_IS)
              )
            ) {
              return `<b>${d.NAME}</b>`
            }

            if (!countriesTotal.find((c) => c.iso === d.ADM0_A3_IS)) {
              return `<b>${d.NAME}</b>`
            }

            if (state === "timed-out") {
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
