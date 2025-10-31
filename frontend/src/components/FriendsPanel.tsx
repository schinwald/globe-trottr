"use client"

import {
  Settings as SettingsIcon,
  UserPlus as UserPlusIcon,
  Users as UsersIcon,
} from "lucide-react"
import type React from "react"
import { useState } from "react"
import { GiPlainCircle as CircleIcon } from "react-icons/gi"
import { LuCircleDashed as EmptyCircleIcon } from "react-icons/lu"
import { RiVipCrownFill as CrownIcon } from "react-icons/ri"
import { Guess } from "@/app/lobby/[roomCode]/components/guess"
import { SettingsModal } from "@/app/lobby/[roomCode]/components/settings-modal"
import type { User } from "../../../backend/src/utils/redis-schema"
import { Floater } from "./floater"
import { Button } from "./ui/button"

interface LobbyProps {
  roomCode: string
  users: (User & { id: string; role: "host" | "guest" })[]
}

const Lobby: React.FC<LobbyProps> = ({ roomCode, users }) => {
  const maxPlayers = 6
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-300 h-full">
      <div className="w-full p-4 flex flex-col justify-center items-between text-left gap-4">
        <div className="flex justify-between">
          <header className="flex items-center">
            <UsersIcon className="size-5 mr-2 text-blue-600" />
            <h2 className="font-medium">Lobby</h2>
          </header>
          <span>
            {users.length} / {maxPlayers}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {users.map((user) => {
            return (
              <Guess.Root key={user.id}>
                <div className="relative border border-primary rounded-lg px-4 py-1 h-12 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CircleIcon className="size-4 text-primary" />
                    <span className="text-sm">{user.username}</span>
                  </div>
                  {user.role === "host" ? (
                    <CrownIcon className="size-4 text-yellow-500" />
                  ) : null}
                  <Guess.Notification userId={user.id} />
                </div>
              </Guess.Root>
            )
          })}
          {Array.from({ length: maxPlayers - users.length }).map((_, i) => {
            const key = `empty-${i}`

            return (
              <div
                key={key}
                className="border border-gray-300 rounded-lg px-4 py-1 h-12 flex items-center gap-2 opacity-30"
              >
                <EmptyCircleIcon className="size-4 text-blue-500" />
                <span className="text-sm">Empty</span>
              </div>
            )
          })}
        </div>
        <Floater.Root>
          <Floater.Trigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(
                  `localhost:3000/lobby/${roomCode}`
                )
              }}
            >
              <UserPlusIcon className="size-5" />
              Invite Friends
            </Button>
          </Floater.Trigger>
          <Floater.Portal>
            <p className="text-sm whitespace-nowrap text-primary">Copied!</p>
          </Floater.Portal>
        </Floater.Root>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsModalOpen(true)}
        >
          Settings
          <SettingsIcon className="size-5" />
        </Button>
      </div>
      <SettingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export { Lobby }
