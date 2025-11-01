"use client"

import { createContext, type PropsWithChildren, useContext } from "react"

type RoomContext = {
  roomCode: string
}

const RoomContext = createContext<RoomContext>({
  roomCode: "",
})

type SettingsProps = {
  roomCode: string
} & PropsWithChildren

export const Provider: React.FC<SettingsProps> = ({ roomCode, children }) => {
  return (
    <RoomContext.Provider
      value={{
        roomCode,
      }}
    >
      {children}
    </RoomContext.Provider>
  )
}

export const useRoom = () => {
  const context = useContext(RoomContext)

  if (!context) {
    throw new Error("useRoom must be used within a Room Provider")
  }

  return context
}

export const Room = {
  Provider,
}
