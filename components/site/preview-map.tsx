"use client"

import { useState } from "react"
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps"
import { Radio, Globe, Map as MapIcon } from "lucide-react"

export function PreviewMap() {
  const [mapType, setMapType] = useState<string>("hybrid")
  const mapKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const epicenter = { lat: 27.4816, lng: 94.5772 }

  if (!mapKey) return null

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border shadow-2xl">
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-border bg-background/90 px-3 py-1.5 backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-seva-ping rounded-full bg-destructive/70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Live Feed · Dhemaji
        </span>
      </div>

      <APIProvider apiKey={mapKey}>
        <Map
          defaultCenter={epicenter}
          defaultZoom={11}
          gestureHandling={"cooperative"}
          disableDefaultUI={true}
          mapTypeId={mapType}
          tilt={45}
        >
          <Marker position={epicenter} />
        </Map>
      </APIProvider>

      <div className="absolute right-4 top-4 z-10 flex items-center rounded-lg border border-border p-0.5 bg-background/90 backdrop-blur-md">
        <button 
          onClick={() => setMapType("roadmap")}
          className={`p-1.5 rounded-md transition ${mapType === "roadmap" ? "bg-muted text-primary" : "text-muted-foreground"}`}
        >
          <MapIcon className="h-3.5 w-3.5" />
        </button>
        <button 
          onClick={() => setMapType("hybrid")}
          className={`p-1.5 rounded-md transition ${mapType === "hybrid" ? "bg-muted text-primary" : "text-muted-foreground"}`}
        >
          <Globe className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
