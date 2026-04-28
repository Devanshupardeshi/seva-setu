"use client"

import { useState, useMemo, useEffect } from "react"
import { regions, type Region } from "@/lib/mock-impact-data"
import { APIProvider, Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps"

const regionCoordinates: Record<string, { lat: number; lng: number }> = {
  mumbai: { lat: 19.0760, lng: 72.8777 },
  pune: { lat: 18.5204, lng: 73.8567 },
  delhi: { lat: 28.7041, lng: 77.1025 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  dhemaji: { lat: 27.4816, lng: 94.5772 },
  guwahati: { lat: 26.1445, lng: 91.7362 },
  patna: { lat: 25.5941, lng: 85.1376 },
  bhopal: { lat: 23.2599, lng: 77.4126 },
}

function HeatmapOverlay({ regions }: { regions: Region[] }) {
  const map = useMap();
  const visualization = useMapsLibrary("visualization");

  const heatmap = useMemo(() => {
    if (!visualization) return null;
    return new visualization.HeatmapLayer({
      radius: 45,
      opacity: 0.8,
      gradient: [
        "rgba(0, 255, 255, 0)",
        "rgba(0, 255, 255, 1)",
        "rgba(0, 191, 255, 1)",
        "rgba(0, 127, 255, 1)",
        "rgba(0, 63, 255, 1)",
        "rgba(0, 0, 255, 1)",
        "rgba(0, 0, 223, 1)",
        "rgba(0, 0, 191, 1)",
        "rgba(0, 0, 159, 1)",
        "rgba(0, 0, 127, 1)",
        "rgba(63, 0, 91, 1)",
        "rgba(127, 0, 63, 1)",
        "rgba(191, 0, 31, 1)",
        "rgba(255, 0, 0, 1)"
      ]
    });
  }, [visualization]);

  useEffect(() => {
    if (!heatmap || !map) return;
    
    // Spread regions with weights corresponding to volunteers
    // Use the actual LatLng
    const heatmapData = regions.flatMap((r) => {
      const coords = regionCoordinates[r.id];
      if (!coords) return [];

      // Add a single point per location weighted by the amount of volunteers
      return [
        {
          location: new (window as any).google.maps.LatLng(coords.lat, coords.lng),
          weight: r.volunteers,
        }
      ]
    });

    heatmap.setData(heatmapData);
    heatmap.setMap(map);

    return () => heatmap.setMap(null);
  }, [heatmap, map, regions]);

  return null;
}

export function IndiaHeatmap() {
  const mapKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  
  const totalVolunteers = regions.reduce((a, r) => a + r.volunteers, 0)
  const totalHours = regions.reduce((a, r) => a + r.hours, 0)

  // Map Setup
  const mapCenter = { lat: 22.9734, lng: 78.6569 } // Central India View
  const mapStyles = [
    { elementType: "geometry", stylers: [{ color: "#000000" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#0d2b1f" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#113824" }] },
  ]

  return (
    <section className="border-y border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              Regional coverage
            </p>
            <h2 className="mt-3 text-balance font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl">
              22 districts,
              <span className="italic text-primary"> one map.</span>
            </h2>
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
              A geospatial view of the pilot. The heatmap visualization portrays volunteer density across regions of India.
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-border pt-8">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  Total volunteers
                </dt>
                <dd className="mt-1 font-serif text-4xl leading-none text-foreground tabular-nums">
                  {totalVolunteers.toLocaleString("en-IN")}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  Hours delivered
                </dt>
                <dd className="mt-1 font-serif text-4xl leading-none text-foreground tabular-nums">
                  {totalHours.toLocaleString("en-IN")}
                </dd>
              </div>
            </dl>

            <ul className="mt-8 flex flex-col gap-3 text-sm">
              <li className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                <span className="text-foreground">Active district</span>
                <span className="ml-auto font-mono text-xs text-muted-foreground">7</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground" />
                <span className="text-foreground">Pilot district</span>
                <span className="ml-auto font-mono text-xs text-muted-foreground">4</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                <span className="text-foreground">Active disaster drill</span>
                <span className="ml-auto font-mono text-xs text-muted-foreground">1</span>
              </li>
            </ul>
          </div>

          <div className="relative lg:col-span-7">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-md">
              
              {!mapKey ? (
                 <div className="flex h-full w-full items-center justify-center text-center">
                   <p className="text-sm text-muted-foreground">Google Maps API Key missing.</p>
                 </div>
              ) : (
                <APIProvider apiKey={mapKey}>
                  <Map
                    defaultCenter={mapCenter}
                    defaultZoom={4.5}
                    gestureHandling={"cooperative"}
                    disableDefaultUI={true}
                    styles={mapStyles}
                  >
                    <HeatmapOverlay regions={regions} />
                  </Map>
                </APIProvider>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
