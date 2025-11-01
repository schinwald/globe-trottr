"use client"

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from "react"
import { trpc } from "@/lib/trpc"
import { useRoom } from "./room"

type SettingsContext = {
  maxPlayers: number
  delay: number
  duration: number
}

const SettingsContext = createContext<SettingsContext>({
  maxPlayers: 0,
  delay: 0,
  duration: 0,
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
  const { roomCode } = useRoom()

  trpc.subscriptionGameSettingsChanges.useSubscription(
    {
      roomCode,
    },
    {
      onData: (data) => {
        setDuration(data.duration)
      },
    }
  )

  return (
    <SettingsContext.Provider
      value={{
        maxPlayers,
        delay,
        duration,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)

  if (!context) {
    throw new Error("useSettings must be used within a Settings Provider")
  }

  return context
}

export const Settings = {
  Provider,
}
