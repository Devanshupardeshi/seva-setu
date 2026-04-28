"use client"

import { useState, useEffect, useRef } from "react"
import { Camera, CheckCircle2, QrCode, RefreshCcw, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Html5QrcodeScanner } from "html5-qrcode"

export function AttendanceQR({ needTitle }: { needTitle: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [scannedName, setScannedName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  useEffect(() => {
    if (isOpen && !scanned) {
      // Small delay to ensure the container is rendered
      const timer = setTimeout(() => {
        const scanner = new Html5QrcodeScanner(
          "reader",
          { fps: 10, qrbox: { width: 250, height: 250 } },
          /* verbose= */ false
        )

        scanner.render(onScanSuccess, onScanFailure)
        scannerRef.current = scanner
      }, 300)

      return () => {
        clearTimeout(timer)
        if (scannerRef.current) {
          scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err))
        }
      }
    }
  }, [isOpen, scanned])

  function onScanSuccess(decodedText: string) {
    try {
      const data = JSON.parse(decodedText)
      if (data.type === "attendance") {
        setScannedName(data.vId === "v_1" ? "Devanshu Pardeshi" : `Volunteer ${data.vId.substring(0, 5)}`)
        setScanned(true)
        setError(null)
        
        // Stop scanning after success
        if (scannerRef.current) {
          scannerRef.current.clear()
        }

        // Auto-reset after 5 seconds to allow next scan
        setTimeout(() => {
          setScanned(false)
          setScannedName("")
        }, 5000)
      } else {
        setError("Invalid QR Code type")
      }
    } catch (e) {
      console.error("Parse error:", e)
      // If it's not JSON, it's definitely not our QR
      setError("Not a valid SevaSetu attendance code")
    }
  }

  function onScanFailure(error: any) {
    // This is called for every frame where no QR is found
    // We don't want to spam the UI with errors
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
              <div id="reader" className="h-full w-full">
                {/* Scanner renders here */}
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

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-muted/50 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background font-mono text-xs">3</div>
              <p className="text-xs text-muted-foreground">Volunteers currently on site. 12 expected.</p>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full gap-2 border-border/50 text-xs text-muted-foreground"
              onClick={() => {
                setError(null)
                if (scannerRef.current) {
                  scannerRef.current.render(onScanSuccess, onScanFailure)
                }
              }}
            >
              <RefreshCcw className="h-3 w-3" />
              Reset Camera
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
