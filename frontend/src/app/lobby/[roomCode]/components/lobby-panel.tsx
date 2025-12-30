"use client"

import { Role } from "@globe-trottr/shared/types/proto/v1/messages/room_connections_pb.js"
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
import { useShallow } from "zustand/shallow"
import { Guess } from "@/app/lobby/[roomCode]/components/messages"
import { Button } from "@/components/ui/button"
import { useGameStore } from "../hooks/room"
import { InviteModal } from "./invite-modal"
import { SettingsModal } from "./settings-modal"

type LobbyProps = Record<string, never>

const LobbyPanel: React.FC<LobbyProps> = () => {
  const { roomCode, users, settings } = useGameStore(
    useShallow((store) => ({
      roomCode: store.roomCode,
      users: store.users,
      settings: store.settings,
    }))
  )

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-300 h-full">
      <div className="h-full w-full p-4 flex flex-col text-left gap-4">
        <div className="flex justify-between">
          <header className="flex items-center">
            <UsersIcon className="size-5 mr-2 text-blue-600" />
            <h2 className="font-medium">Lobby</h2>
          </header>
          <span>
            {users.length} / {settings.maxPlayers}
          </span>
        </div>
        <div className="grow flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            {users.map((user) => {
              console.log(user)
              return (
                <Guess.Root key={user.id}>
                  <div className="relative border border-gray-600 shadow-sm rounded-lg px-4 py-1 h-12 flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <CircleIcon className="shrink-0 size-4 text-primary" />
                      <span className="shrink text-sm truncate">
                        {user.username}
                      </span>
                    </div>
                    {user.role === Role.HOST ? (
                      <CrownIcon className="ml-2 shrink-0 size-4 text-yellow-500" />
                    ) : null}
                    <Guess.Notification userId={user.id} />
                  </div>
                </Guess.Root>
              )
            })}
            {Array.from({ length: settings.maxPlayers - users.length }).map(
              (_, i) => {
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
              }
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsInviteModalOpen(true)}
            >
              <div className="flex gap-1 items-center hover:scale-[102%] transition-transform">
                <UserPlusIcon className="-ml-2 size-5" />
                Invite Friends
              </div>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettingsModalOpen(true)}
            >
              <div className="flex gap-1 items-center hover:scale-[102%] transition-transform">
                <SettingsIcon className="-ml-2 size-5" />
                Settings
              </div>
            </Button>
          </div>
        </div>
      </div>
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        roomCode={roomCode}
        qrDataUrl={""}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  )
}

export { LobbyPanel }
