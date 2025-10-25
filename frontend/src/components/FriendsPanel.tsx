"use client"

import { Users } from "lucide-react"
import type React from "react"
import { useId, useState } from "react"
import type { Friend } from "../types"

interface FriendsPanelProps {
  friends: Friend[]
  roomCode?: string
  users: string[]
  onJoin: (roomCode: string, user: { name: string }) => void
}

const Lobby: React.FC<FriendsPanelProps> = ({
  friends: _friends,
  roomCode,
  users,
  onJoin,
}) => {
  const roomCodeId = useId()
  const userNameId = useId()
  const [joinCode, setJoinCode] = useState("")
  const [name, setName] = useState("")

  const handleJoin = () => {
    if (joinCode && name) {
      onJoin(joinCode, { name })
      setJoinCode("")
      setName("")
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-300 flex items-start h-full">
      <div className="w-full px-4 py-3 flex flex-col justify-center items-between text-left gap-2">
        <header className="flex items-center">
          <Users className="mr-2 text-blue-600" size={20} />
          <h2 className="font-medium">Lobby</h2>
        </header>
        {/* {roomCode && ( */}
        {/*   <div className="text-sm text-gray-600"> */}
        {/*     Room Code: <span className="font-mono font-bold">{roomCode}</span> */}
        {/*   </div> */}
        {/* )} */}
        {/* <div className="text-sm"> */}
        {/*   <div className="font-medium mb-1">Players:</div> */}
        {/*   <ul className="list-disc list-inside"> */}
        {/*     {users.map((user) => ( */}
        {/*       <li key={user} className="text-gray-700"> */}
        {/*         {user} */}
        {/*       </li> */}
        {/*     ))} */}
        {/*   </ul> */}
        {/* </div> */}
        {/* <div className="mt-4 space-y-2"> */}
        {/*   <div className="text-sm font-medium">Join Room</div> */}
        {/*   <div> */}
        {/*     <Label htmlFor={roomCodeId} className="text-xs"> */}
        {/*       Room Code */}
        {/*     </Label> */}
        {/*     <Input */}
        {/*       id={roomCodeId} */}
        {/*       type="text" */}
        {/*       placeholder="Enter room code" */}
        {/*       value={joinCode} */}
        {/*       onChange={(e) => setJoinCode(e.target.value)} */}
        {/*     /> */}
        {/*   </div> */}
        {/*   <div> */}
        {/*     <Label htmlFor={userNameId} className="text-xs"> */}
        {/*       Your Name */}
        {/*     </Label> */}
        {/*     <Input */}
        {/*       id={userNameId} */}
        {/*       type="text" */}
        {/*       placeholder="Enter your name" */}
        {/*       value={name} */}
        {/*       onChange={(e) => setName(e.target.value)} */}
        {/*     /> */}
        {/*   </div> */}
        {/*   <Button onClick={handleJoin} size="sm" className="w-full"> */}
        {/*     Join */}
        {/*   </Button> */}
        {/* </div> */}
      </div>
    </div>
  )
}

export { Lobby }
