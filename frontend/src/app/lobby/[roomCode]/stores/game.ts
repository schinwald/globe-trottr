"use client"

import type { Role } from "@globe-trottr/shared/types/proto/v1/messages/room_connections_pb.js"
import type { UserMessage } from "@globe-trottr/shared/types/proto/v1/messages/user_messages_pb.js"
import {
  type Country,
  countries,
} from "@globe-trottr/shared/utils/countries.js"
import {
  deriveGameState,
  type GameState,
} from "@globe-trottr/shared/utils/game.js"
import { dateFromTimestamp } from "@globe-trottr/shared/utils/protobuf.js"
import { createStore } from "zustand"
import { client } from "@/trpc"
import type { User } from "../../../../../../backend/src/utils/redis/models/users/types"

export type GameProps = {
  roomCode: string
  qrcodeDataURL: string
  me: User
  users: {
    id: string
    username: string
    role: Role
  }[]
  state: GameState
  countriesTotal: Country[]
  countriesFound: Country[]
  guess: {
    score: number
  } | null
  dismissGuess: () => void
  messages: Record<string, UserMessage>
  sendMessage: (message: string) => void
  dismissMessage: (id: string) => void
  settings: {
    maxPlayers: number
    delay: number
    duration: number
  }
  changeSettings: (settings: { delay: number; duration: number }) => void
  timer: number | null
  startedAt: Date | null
  startGame: () => void
  connect: () => void
  disconnect: () => void
}

export type GameStore = ReturnType<typeof createGameStore>

type CreateGameStoreArgs = {
  me: User
  roomCode: string
  qrcodeDataURL: string
}

export const createGameStore = (args: CreateGameStoreArgs) => {
  return createStore<GameProps>((set, get) => ({
    roomCode: args.roomCode,
    qrcodeDataURL: args.qrcodeDataURL,
    me: args.me,
    users: [],
    state: "in-progress",
    countriesTotal: countries,
    countriesFound: [],
    settings: {
      maxPlayers: 0,
      delay: 0,
      duration: 0,
    },
    guess: null,
    dismissGuess: () => {
      set((previous) => {
        return {
          ...previous,
          guess: null,
        }
      })
    },
    messages: {},
    sendMessage: (message) => {
      const { roomCode } = get()
      client.mutationUserMessage.mutate({
        roomCode,
        message,
      })
    },
    dismissMessage: (id) => {
      set((previous) => {
        delete previous.messages[id]
        return {
          ...previous,
          messages: {
            ...previous.messages,
          },
        }
      })
    },
    changeSettings: (settings) => {
      const { roomCode } = get()
      client.mutationGameSettings.mutate({
        roomCode,
        settings,
      })
    },
    timer: null,
    startedAt: null,
    startGame: () => {
      const { roomCode } = get()
      client.mutationGameStart.mutate({
        roomCode,
      })

      set((previous) => {
        return {
          ...previous,
          countriesFound: [],
        }
      })
    },
    connect: () => {
      const { roomCode } = get()

      client.subscriptionRoomConnections.subscribe(
        {
          roomCode,
        },
        {
          onData: (data) => {
            set((previous) => ({
              ...previous,
              users: data.users,
            }))
          },
        }
      )

      client.subscriptionGameSettings.subscribe(
        {
          roomCode,
        },
        {
          onData: (data) => {
            set((previous) => ({
              ...previous,
              settings: {
                ...previous.settings,
                maxPlayers: data.maxPlayers,
                delay: data.delay,
                duration: data.duration,
              },
            }))
          },
        }
      )

      client.subscriptionGameStatuses.subscribe(
        {
          roomCode,
        },
        {
          onData: (data) => {
            set((previous) => {
              const currentTime = new Date()
              const startedAt = dateFromTimestamp(data.startedAt) ?? null
              const newTimer = startedAt
                ? currentTime.getTime() - startedAt.getTime()
                : 0

              // TODO: reset countries found
              const state = deriveGameState({
                startedAt,
                duration: previous.settings.duration,
                delay: previous.settings.delay,
                countriesFound: previous.countriesFound,
              })

              return {
                ...previous,
                state,
                startedAt,
                timer: newTimer,
                countriesFound: [],
              }
            })

            const gameLoop = () => {
              return setTimeout(() => {
                set((previous) => {
                  console.log(previous.state)

                  // TODO: stop timeout
                  if (!previous.startedAt) return previous
                  if (previous.timer === null) return previous
                  if (previous.state === "won") return previous

                  const currentTime = new Date()
                  const newTimer =
                    currentTime.getTime() - previous.startedAt.getTime()

                  const state = deriveGameState({
                    startedAt: previous.startedAt,
                    duration: previous.settings.duration,
                    delay: previous.settings.delay,
                    countriesFound: previous.countriesFound,
                  })

                  return {
                    ...previous,
                    state,
                    timer: newTimer,
                  }
                })

                gameLoop()
              }, 200)
            }

            // TODO: clean this up
            const id = gameLoop()
          },
        }
      )

      client.subscriptionUserMessages.subscribe(
        {
          roomCode,
        },
        {
          onData: (data) => {
            const { me } = get()

            set((previous) => {
              return {
                ...previous,
                messages: {
                  ...previous.messages,
                  [data.id]: data,
                },
              }
            })

            if (!("case" in data.meta)) return

            switch (data.meta.case) {
              case "metaGuess": {
                const { score, countryId } = data.meta.value

                set((previous) => {
                  const newGuess =
                    data.userId === me.id
                      ? { id: data.id, score }
                      : previous.guess

                  return {
                    ...previous,
                    guess: newGuess,
                  }
                })

                if (score === 1) {
                  const { countriesFound, countriesTotal } = get()

                  const alreadyExists = Boolean(
                    countriesFound.find((country) => country.id === countryId)
                  )

                  if (alreadyExists) return

                  const newCountry = countriesTotal.find(
                    (country) => country.id === countryId
                  )

                  if (!newCountry) return

                  set((previous) => {
                    const newCountriesFound = [
                      newCountry,
                      ...previous.countriesFound,
                    ]

                    const state = deriveGameState({
                      startedAt: previous.startedAt,
                      duration: previous.settings.duration,
                      delay: previous.settings.delay,
                      countriesFound: newCountriesFound,
                    })

                    return {
                      ...previous,
                      state,
                      countriesFound: newCountriesFound,
                    }
                  })
                }
                break
              }
              case "metaMessage": {
                break
              }
            }
          },
        }
      )

      client.queryCountriesFound.query({ roomCode }).then((data) => {
        const mapping = new Map(
          data.map((country) => [country.countryId, country])
        )

        set((previous) => {
          return {
            ...previous,
            countriesFound: previous.countriesTotal
              .filter((country) => mapping.has(country.id))
              .sort(
                (a, b) =>
                  mapping.get(b.id)!.timestamp.getTime() -
                  mapping.get(a.id)!.timestamp.getTime()
              ),
          }
        })
      })
    },
    disconnect: () => {
      console.log("disconnecting")
    },
  }))
}
