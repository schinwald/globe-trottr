"use client"

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from "react"

type SettingsContext = {
  maxPlayers: number
  delay: number
  duration: number
  setDuration: (duration: number) => void
}

const SettingsContext = createContext<SettingsContext>({
  maxPlayers: 0,
  delay: 0,
  duration: 0,
  setDuration: () => {},
})

type SettingsProps = {
  maxPlayers: number
  delay: number
  defaultDuration: number
} & PropsWithChildren

export const Provider: React.FC<SettingsProps> = ({
  maxPlayers,
  delay,
  defaultDuration,
  children,
}) => {
  const [duration, setDuration] = useState(defaultDuration)

  return (
    <SettingsContext.Provider
      value={{
        maxPlayers,
        delay,
        duration,
        setDuration,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)

  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }

  return context
}

export const Settings = {
  Provider,
}
