"use client"
import { useState } from "react"
import { QrCode, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface AttendanceQRProps {
  volunteerId: string
  needId: string
  matchId: string
}

export function AttendanceQRModal({ volunteerId, needId, matchId }: AttendanceQRProps) {
  const qrData = JSON.stringify({
    type: "attendance",
    vId: volunteerId,
    nId: needId,
    mId: matchId,
    timestamp: new Date().toISOString()
  })

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2 md:w-auto">
          <QrCode className="h-4 w-4" />
          Attendance QR
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-serif text-2xl">Attendance Verification</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-6 py-6">
          <div className="relative rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5">
            <img 
              src={qrUrl} 
              alt="Attendance QR Code" 
              className="h-64 w-64"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <span className="font-mono text-xs rotate-45 select-none">SEVA SETU VERIFIED</span>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-sm font-medium">Show this to the NGO coordinator</p>
            <p className="text-xs text-muted-foreground max-w-[280px]">
              They will scan this using the SevaSetu NGO dashboard to verify your attendance for today's task.
            </p>
          </div>

          <div className="w-full rounded-lg bg-muted/50 p-4">
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              <span>Volunteer ID: {volunteerId.substring(0, 8)}...</span>
              <span>Need ID: {needId.substring(0, 8)}...</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
