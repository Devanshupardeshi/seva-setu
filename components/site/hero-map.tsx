"use client"

import { useState, useEffect, useMemo } from "react"
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps"
import { Globe, Map as MapIcon, Navigation } from "lucide-react"

export function HeroMap() {
  const [mapType, setMapType] = useState<string>("hybrid")
  const [mobilized, setMobilized] = useState(342)
  const [elapsed, setElapsed] = useState(47)
  const mapKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => prev + 1)
      if (Math.random() > 0.8) {
        setMobilized(prev => prev + 1)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  const center = { lat: 22.9734, lng: 78.6569 }
  const epicenter = { lat: 27.4816, lng: 94.5772 }

  const volunteers = useMemo(() => [
    { id: 1, lat: 19.0760, lng: 72.8777, label: "MUM" },
    { id: 2, lat: 28.7041, lng: 77.1025, label: "DEL" },
    { id: 3, lat: 13.0827, lng: 80.2707, label: "CHE" },
    { id: 4, lat: 12.9716, lng: 77.5946, label: "BLR" },
    { id: 5, lat: 22.5726, lng: 88.3639, label: "KOL" },
    { id: 6, lat: 26.1445, lng: 91.7362, label: "GAU" },
  ], [])

  if (!mapKey) {
    return (
      <div className="relative flex aspect-[4/5] w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-sm">
         <p className="text-sm text-muted-foreground text-center">Google Maps API <br/> Key missing.</p>
      </div>
    )
  }

  return (
    <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border bg-card shadow-2xl transition-all duration-700 hover:shadow-primary/30">
      {/* Top Left Badge */}
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-border bg-background/90 px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur-md shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-seva-ping rounded-full bg-accent/70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
        </span>
        Live Drill Active
      </div>

      {/* Top Right Location */}
      <div className="absolute right-4 top-4 z-10 rounded-md border border-border bg-background/90 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur-md shadow-sm">
        Assam Region
      </div>

      {/* Map Controls */}
      <div className="absolute left-4 top-14 z-10 flex flex-col gap-2">
        <div className="flex flex-col gap-1 rounded-lg border border-border p-1 bg-background/90 backdrop-blur-md shadow-lg">
          <button 
            onClick={() => setMapType("roadmap")}
            title="Roadmap View"
            className={`p-2 rounded-md transition-all ${mapType === "roadmap" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <MapIcon className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setMapType("hybrid")}
            title="Satellite View"
            className={`p-2 rounded-md transition-all ${mapType === "hybrid" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <Globe className="h-4 w-4" />
          </button>
        </div>
      </div>

      <APIProvider apiKey={mapKey}>
        <Map
          mapId={"689a9f244196191b"} // High fidelity map ID
          defaultCenter={center}
          defaultZoom={4.8}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          mapTypeId={mapType}
          tilt={45}
          reuseMaps={true}
          colorScheme="DARK"
        >
          {/* Epicenter Marker with Pulse */}
          <AdvancedMarker position={epicenter}>
            <div className="relative flex h-8 w-8 items-center justify-center">
              <span className="absolute h-full w-full animate-ping rounded-full bg-destructive/40" />
              <div className="relative h-4 w-4 rounded-full border-2 border-white bg-destructive shadow-lg" />
            </div>
          </AdvancedMarker>
          
          {volunteers.map((v) => (
            <AdvancedMarker key={v.id} position={{ lat: v.lat, lng: v.lng }}>
              <div className="flex flex-col items-center">
                <div className="rounded border border-white/20 bg-background/80 px-1 py-0.5 font-mono text-[8px] text-foreground backdrop-blur-sm">
                  {v.label}
                </div>
                <div className="h-2 w-2 rounded-full border border-white/50 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
              </div>
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>

      {/* Bottom Stats */}
      <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1 rounded-2xl border border-border bg-background/90 px-5 py-3 backdrop-blur-xl shadow-xl border-l-4 border-l-primary">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            Total Responders
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-3xl leading-none text-foreground tabular-nums tracking-tighter">
              {mobilized}
            </span>
            <span className="text-[10px] text-primary animate-pulse font-medium">↑ LIVE</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-1 rounded-2xl border border-border bg-background/90 px-5 py-3 text-right backdrop-blur-xl shadow-xl">
          <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            Mission Clock
          </div>
          <div className="font-serif text-3xl leading-none text-foreground tabular-nums tracking-tighter">
            {formatTime(elapsed)}
          </div>
        </div>
      </div>

      {/* Scanning Line Effect */}
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden opacity-10">
        <div className="h-full w-full bg-[linear-gradient(to_bottom,transparent_49%,#fff_50%,transparent_51%)] bg-[length:100%_4px] animate-scan" />
      </div>
    </div>
  )
}
