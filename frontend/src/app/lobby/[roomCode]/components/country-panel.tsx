import { AnimatePresence, motion } from "framer-motion"
import { MapIcon } from "lucide-react"
import type React from "react"
import { useCallback } from "react"
import { useShallow } from "zustand/shallow"
import { useGameStore } from "../hooks/room"

type CountryPanelProps = Record<string, never>

const CountryPanel: React.FC<CountryPanelProps> = () => {
  const { state, countriesFound, countriesTotal } = useGameStore(
    useShallow((store) => ({
      state: store.state,
      countriesFound: store.countriesFound,
      countriesTotal: store.countriesTotal,
    }))
  )

  const getMissedCountries = useCallback(() => {
    if (state !== "timed-out") return []
    const mapping = new Map(
      countriesFound.map((country) => [country.iso, country])
    )
    return countriesTotal.filter((country) => !mapping.has(country.iso))
  }, [countriesFound, countriesTotal, state])

  const countriesMissed = getMissedCountries()

  return (
    <div className="bg-white rounded-xl border border-gray-300 shadow-xl flex flex-col gap-4 p-4 h-full">
      <div className="flex justify-between">
        <header className="flex items-center">
          <MapIcon className="mr-2 text-blue-600" />
          <h2 className="font-medium">Countries</h2>
        </header>
        <span>
          {countriesFound.length} / {countriesTotal.length}
        </span>
      </div>
      <div className="rounded-lg outline-gray-200 outline-1 border-10 border-white flex flex-col overflow-y-auto gap-2 h-full">
        {countriesMissed.length + countriesFound.length > 0 ? (
          <AnimatePresence>
            {countriesMissed.map((country) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="shrink-0 px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm truncate"
              >
                {country.name}
              </motion.div>
            ))}
            {countriesFound.map((country) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="shrink-0 px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm truncate"
              >
                {country.name}
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <p className="text-gray-500 italic text-sm px-3 py-1">
            No countries guessed yet
          </p>
        )}
      </div>
    </div>
  )
}

export { CountryPanel }
