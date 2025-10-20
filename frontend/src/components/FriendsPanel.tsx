import { Users } from "lucide-react"
import type React from "react"
import type { Friend } from "../types"

interface FriendsPanelProps {
  friends: Friend[]
}

const FriendsPanel: React.FC<FriendsPanelProps> = ({ friends: _friends }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex items-start">
      <div className="w-full px-4 py-3 flex flex-col justify-center items-between text-left gap-2">
        <div className="flex items-center">
          <Users className="mr-2 text-blue-600" size={20} />
          <span className="font-medium">Lobby</span>
        </div>
      </div>
    </div>
  )
}

export default FriendsPanel
