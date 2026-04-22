"use client"

import { useState } from "react"
import { Camera, CheckCircle2, QrCode, RefreshCcw, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AttendanceQR({ needTitle }: { needTitle: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [scannedName, setScannedName] = useState("")

  const handleScanMock = () => {
    // Simulating a QR scan
    setScannedName("Devanshu Pardeshi")
    setScanned(true)
    setTimeout(() => {
      setScanned(false)
      setScannedName("")
    }, 3000)
  }

  if (!isOpen) {
    return (
      <Button 
        variant="outline" 
        className="gap-2 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
        onClick={() => setIsOpen(true)}
      >
        <QrCode className="h-4 w-4" />
        Track Attendance
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h3 className="font-serif text-xl tracking-tight">Attendance Scanner</h3>
            <p className="text-xs text-muted-foreground">{needTitle}</p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-8">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-black">
            {!scanned ? (
              <div className="flex h-full flex-col items-center justify-center text-white">
                <Camera className="h-12 w-12 opacity-20" />
                <div className="absolute inset-8 border-2 border-primary/50 border-dashed rounded-2xl animate-pulse" />
                <p className="mt-4 text-xs font-mono uppercase tracking-widest opacity-50">Point camera at volunteer QR</p>
                
                {/* Mock Scan Trigger */}
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="absolute bottom-4 opacity-50 hover:opacity-100"
                  onClick={handleScanMock}
                >
                  Mock Scan Success
                </Button>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center bg-primary text-white animate-in fade-in zoom-in duration-300">
                <CheckCircle2 className="h-20 w-20" />
                <h4 className="mt-4 font-serif text-2xl tracking-tight">Verified!</h4>
                <p className="mt-1 font-mono text-sm opacity-90">{scannedName}</p>
                <p className="mt-4 text-[10px] uppercase tracking-widest opacity-70">Presence logged for task</p>
              </div>
            )}
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-muted/50 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background font-mono text-xs">3</div>
              <p className="text-xs text-muted-foreground">Volunteers currently on site. 12 expected.</p>
            </div>
            
            <Button variant="outline" className="w-full gap-2 border-border/50 text-xs text-muted-foreground">
              <RefreshCcw className="h-3 w-3" />
              Reset Camera
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
