"use client"

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { useStore } from "zustand"
import type { User } from "../../../../../../backend/src/utils/redis/models/users/types"
import { createGameStore, type GameProps, type GameStore } from "../stores/game"

const GameContext = createContext<GameStore | null>(null)

type SettingsProps = {
  me: User
  roomCode: string
  qrcodeDataURL: string
} & PropsWithChildren

export const Provider: React.FC<SettingsProps> = ({
  me,
  roomCode,
  qrcodeDataURL,
  children,
}) => {
  const [store] = useState(() =>
    createGameStore({ me, roomCode, qrcodeDataURL })
  )
  const ref = useRef(false)

  useEffect(() => {
    if (ref.current) return
    ref.current = true
    const state = store.getState()
    state.connect()
  }, [store.getState])

  return <GameContext.Provider value={store}>{children}</GameContext.Provider>
}

export function useGameStore<T>(selector: (state: GameProps) => T): T {
  const store = useContext(GameContext)
  if (!store) throw new Error("Missing Game.Provider in the tree")
  return useStore(store, selector)
}

export const Game = {
  Provider,
}
