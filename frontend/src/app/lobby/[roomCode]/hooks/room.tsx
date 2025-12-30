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
import { createGameStore, type GameProps, type GameStore } from "../stores/game"

const GameContext = createContext<GameStore | null>(null)

type SettingsProps = {
  roomCode: string
} & PropsWithChildren

export const Provider: React.FC<SettingsProps> = ({ roomCode, children }) => {
  const [store] = useState(() => createGameStore(roomCode))
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
