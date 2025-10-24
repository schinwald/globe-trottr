"use client"

import { Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Leaderboard() {
  // Mock data - replace with real data from API
  const leaderboard = [
    { name: "Alice", score: 195, countries: 195 },
    { name: "Bob", score: 180, countries: 180 },
    { name: "Charlie", score: 165, countries: 165 },
    { name: "Diana", score: 150, countries: 150 },
    { name: "Eve", score: 135, countries: 135 },
  ]

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Trophy className="mx-auto mb-4 text-yellow-500" size={48} />
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">Top players this week</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <div className="space-y-4">
              {leaderboard.map((player, index) => (
                <div
                  key={player.name}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{player.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {player.countries} countries
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{player.score}</p>
                    <p className="text-sm text-muted-foreground">points</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to Game
          </Button>
        </div>
      </div>
    </div>
  )
}

