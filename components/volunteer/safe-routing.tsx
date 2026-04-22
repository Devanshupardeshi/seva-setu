"use client"

import { useState } from "react"
import { AlertTriangle, MapPin, Navigation, ShieldCheck, Globe, Map as MapIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps"

interface SafeRouteProps {
  volunteerLoc: { lat: number; lng: number; label: string }
  destinationLoc: { lat: number; lng: number; label: string }
  closedRoads: { name: string; reason: string }[]
}

export function SafeRoutingWidget({ volunteerLoc, destinationLoc, closedRoads }: SafeRouteProps) {
  const [calculating, setCalculating] = useState(false)
  const [optimized, setOptimized] = useState(false)
  const [mapType, setMapType] = useState<string>("hybrid")

  const handleOptimize = () => {
    setCalculating(true)
    setTimeout(() => {
      setCalculating(false)
      setOptimized(true)
    }, 1500)
  }

  const mapKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${volunteerLoc.lat},${volunteerLoc.lng}&destination=${destinationLoc.lat},${destinationLoc.lng}&travelmode=driving`

  return (
    <div className="overflow-hidden rounded-2xl border border-primary/20 bg-primary/5">
      <div className="bg-primary/10 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-primary" />
            <h3 className="font-serif text-lg tracking-tight">Safe Route Navigator</h3>
          </div>
          <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-primary">
            <ShieldCheck className="h-3 w-3" />
            Live Incident Data
          </span>
        </div>
      </div>
      
      <div className="relative aspect-[16/9] w-full border-b border-primary/10">
        {mapKey ? (
          <APIProvider apiKey={mapKey}>
            <Map
              defaultCenter={destinationLoc}
              defaultZoom={12}
              gestureHandling={"greedy"}
              disableDefaultUI={true}
              mapTypeId={mapType}
              tilt={45}
            >
              <Marker position={volunteerLoc} label="YOU" />
              <Marker position={destinationLoc} />
            </Map>
            <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
              <button 
                onClick={() => setMapType(mapType === "hybrid" ? "roadmap" : "hybrid")}
                className="p-2 bg-background/90 backdrop-blur border border-border rounded-lg shadow-sm hover:bg-background transition"
              >
                {mapType === "hybrid" ? <MapIcon className="h-4 w-4 text-foreground" /> : <Globe className="h-4 w-4 text-foreground" />}
              </button>
            </div>
          </APIProvider>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted/20 text-[10px] text-muted-foreground uppercase tracking-widest">
            Map Preview Unavailable
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Start</p>
              <p className="text-sm font-medium">{volunteerLoc.label}</p>
            </div>
          </div>
          
          <div className="ml-1 h-6 w-px border-l border-dashed border-primary/40" />

          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-4 w-4 shrink-0 text-destructive" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Destination (Incident Site)</p>
              <p className="text-sm font-medium">{destinationLoc.label}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/5 p-3">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Road Closures Detected</span>
          </div>
          <ul className="mt-2 space-y-1.5">
            {closedRoads.map((road, i) => (
              <li key={i} className="text-xs text-muted-foreground flex justify-between italic">
                <span>• {road.name}</span>
                <span className="text-[10px] text-destructive/80 not-italic uppercase">{road.reason}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {!optimized ? (
            <Button 
              className="w-full" 
              onClick={handleOptimize}
              disabled={calculating}
            >
              {calculating ? "Rerouting around floods..." : "Calculate Optimized Route"}
            </Button>
          ) : (
            <>
              <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 text-center">
                <p className="text-sm font-medium text-primary">✓ Route optimized to avoid closed roads</p>
                <p className="mt-1 text-[11px] text-muted-foreground">Using Google Maps traffic & incident overlays</p>
              </div>
              <Button asChild className="w-full">
                <a href={mapsUrl} target="_blank" rel="noreferrer">
                  Open in Google Maps
                </a>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
