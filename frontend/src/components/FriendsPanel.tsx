"use client"

import { Users } from "lucide-react"
import type React from "react"
import { GiPlainCircle as CircleIcon } from "react-icons/gi"
import { LuCircleDashed as EmptyCircleIcon } from "react-icons/lu"
import { RiVipCrownFill as CrownIcon } from "react-icons/ri"

interface FriendsPanelProps {
  users: string[]
}

const Lobby: React.FC<FriendsPanelProps> = ({ users }) => {
  const maxPlayers = 6

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-300 h-full">
      <div className="w-full p-4 flex flex-col justify-center items-between text-left gap-4">
        <div className="flex justify-between">
          <header className="flex items-center">
            <Users className="mr-2 text-blue-600" size={20} />
            <h2 className="font-medium">Lobby</h2>
          </header>
          <span>
            {users.length} / {maxPlayers}
          </span>
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto">
          {users.map((user) => {
            return (
              <div
                key={user}
                className="border border-primary rounded-lg px-3 py-1 h-10 flex items-center gap-2"
              >
                {/* <CrownIcon className="size-4 text-yellow-500" /> */}
                <CircleIcon className="size-4 text-primary" />
                <span className="text-sm">{user}</span>
              </div>
            )
          })}
          {Array.from({ length: maxPlayers - users.length }).map((_, i) => {
            const key = `empty-${i}`

            return (
              <div
                key={key}
                className="border border-gray-300 rounded-lg px-3 py-1 h-10 flex items-center gap-2 opacity-30"
              >
                <EmptyCircleIcon className="size-4 text-blue-500" />
                <span className="text-sm">Slot</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export { Lobby }
