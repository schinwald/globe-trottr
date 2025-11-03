"use client"

import { Copy } from "lucide-react"
import { useMemo } from "react"
import { Floater } from "@/components/floater"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface InviteModalProps {
  isOpen: boolean
  onClose: () => void
  roomCode: string
  qrDataUrl?: string
}

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  roomCode,
  qrDataUrl,
}) => {
  const inviteUrl = useMemo(() => {
    if (typeof window === "undefined") return ""
    return `${window.location.origin}/lobby/${roomCode}`
  }, [roomCode])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Invite Friends
          </DialogTitle>
          <DialogDescription>
            Share this QR code or link to invite friends.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <div className="space-y-4">
              {qrDataUrl && (
                <div className="flex justify-center">
                  <img
                    src={qrDataUrl}
                    alt="QR Code for room invite"
                    className="w-48 h-48 border border-gray-300 rounded-lg"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Input value={inviteUrl} readOnly className="flex-1" />
                <Floater.Root>
                  <Floater.Trigger asChild>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(inviteUrl)
                      }}
                      variant="outline"
                    >
                      <div className="hover:scale-[105%] transition-transform">
                        <Copy className="size-4" />
                      </div>
                    </Button>
                  </Floater.Trigger>
                  <Floater.Portal className="">Copied!</Floater.Portal>
                </Floater.Root>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

