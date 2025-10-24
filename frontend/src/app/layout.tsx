import type { Metadata } from "next"
import { TRPCProvider } from "@/providers"
import "./globals.css"

const backgroundURL = "/topography.svg"

export const metadata: Metadata = {
  title: "World-Wide Wonders",
  description: "Guess as many countries as you can before the timer runs out!",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="w-screen h-screen">
        <div className="grid w-full h-full z-0">
          <div className="col-span-full row-span-full pointer-events-none min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <img
              src={backgroundURL}
              alt="Globe Trotters Logo"
              className="w-full h-full object-cover opacity-10"
            />
          </div>
          <div className="col-span-full row-span-full z-10">
            <TRPCProvider>{children}</TRPCProvider>
          </div>
        </div>
      </body>
    </html>
  )
}
