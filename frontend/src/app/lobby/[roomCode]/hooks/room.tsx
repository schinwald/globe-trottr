"use client"

import { createContext, type PropsWithChildren, useContext } from "react"

type RoomContext = {
  roomCode: string
  qrcodeDataURL: string
}

const RoomContext = createContext<RoomContext>({
  roomCode: "",
  qrcodeDataURL: "",
})

type SettingsProps = {
  roomCode: string
  qrcodeDataURL: string
} & PropsWithChildren

export const Provider: React.FC<SettingsProps> = ({
  roomCode,
  qrcodeDataURL,
  children,
}) => {
  return (
    <RoomContext.Provider
      value={{
        roomCode,
        qrcodeDataURL,
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
