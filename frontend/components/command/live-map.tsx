"use client"

import { useEffect, useState, useMemo, memo, useCallback } from "react"
import { Expand, Radio, Map as MapIcon, Globe, Crosshair } from "lucide-react"
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps"
import type { Responder, Sector } from "@/lib/mock-incident-data"

type Props = {
  responders: Responder[]
  sectors: Sector[]
  epicenterLabel: string
  radiusKm: number
}

const epicenter = { lat: 27.4816, lng: 94.5772 }

function toLatLng(x: number, y: number) {
  return {
    lat: epicenter.lat + (0.5 - y) * 0.4,
    lng: epicenter.lng + (x - 0.5) * 0.6,
  }
}

const LiveClock = memo(function LiveClock() {
  const [clock, setClock] = useState("")

  useEffect(() => {
    const tick = () => {
      setClock(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      )
    }
    tick()
    const i = setInterval(tick, 1000)
    return () => clearInterval(i)
  }, [])

  return <span className="font-mono text-xs tabular-nums text-muted-foreground">{clock} IST</span>
})

// Sub-component to handle map instances and interactions
function MapContent({ 
  mapId, 
  mapType, 
  responders, 
  onMarkerClick 
}: { 
  mapId: string
  mapType: string
  responders: any[]
  onMarkerClick: (pos: google.maps.LatLngLiteral) => void
}) {
  const map = useMap(mapId)

  const handleRecenter = useCallback(() => {
    if (map) {
      map.panTo(epicenter)
      map.setZoom(11)
    }
  }, [map])

  return (
    <>
      <Map
        id={mapId}
        defaultCenter={epicenter}
        defaultZoom={11}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        mapTypeId={mapType}
        tilt={45}
        reuseMaps={true}
      >
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
          <button 
            onClick={handleRecenter}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/90 text-muted-foreground shadow-sm backdrop-blur-md transition-all hover:bg-background hover:text-primary active:scale-95"
            title="Recenter Map"
          >
            <Crosshair className="h-4 w-4" />
          </button>
        </div>

        <Marker 
          position={epicenter} 
          zIndex={100}
          onClick={() => map?.panTo(epicenter)}
        />

        {responders.map((r) => (
          <Marker
            key={r.id}
            position={r.position}
            icon={r.iconUrl}
            onClick={() => {
              if (map) {
                map.panTo(r.position)
                map.setZoom(14)
              }
            }}
          />
        ))}
      </Map>
    </>
  )
}

export function LiveMap({ responders, epicenterLabel, radiusKm }: Props) {
  const [mapType, setMapType] = useState<string>("hybrid")
  const mapKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const mapId = "live-command-map"

  const memoizedResponders = useMemo(() => {
    return responders.map((r) => ({
      ...r,
      position: toLatLng(r.x, r.y),
      iconUrl: r.status === "committed" 
        ? "http://maps.google.com/mapfiles/ms/icons/orange-dot.png" 
        : r.status === "en-route" 
        ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" 
        : "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
    }))
  }, [responders])

  if (!mapKey) {
    return (
      <div className="relative flex aspect-[16/10] w-full flex-col items-center justify-center rounded-2xl border border-border bg-card">
        <p className="text-sm text-muted-foreground">Google Maps API Key missing.</p>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-seva-ping rounded-full bg-destructive/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Live map
          </span>
          <span className="text-sm font-medium text-foreground">{epicenterLabel}</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            · {radiusKm} km radius
          </span>
        </div>
        <div className="flex items-center gap-3">
          <LiveClock />
          <div className="flex items-center rounded-lg border border-border p-0.5 bg-muted/30">
            <button 
              onClick={() => setMapType("roadmap")}
              className={`p-1.5 rounded-md transition-all ${mapType === "roadmap" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <MapIcon className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={() => setMapType("hybrid")}
              className={`p-1.5 rounded-md transition-all ${mapType === "hybrid" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Globe className="h-3.5 w-3.5" />
            </button>
          </div>
          <button className="rounded-md border border-border p-1.5 text-muted-foreground transition hover:bg-muted">
            <Expand className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="relative aspect-[16/10] w-full bg-muted/10">
        <APIProvider apiKey={mapKey}>
          <MapContent 
            mapId={mapId} 
            mapType={mapType} 
            responders={memoizedResponders}
            onMarkerClick={() => {}}
          />
        </APIProvider>
      </div>
    </div>
  )
}
