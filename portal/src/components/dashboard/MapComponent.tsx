"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon issue in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl =
  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom colored dots for RAG status
const createColoredIcon = (color: string) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
};

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function MapComponent() {
  const [mapReady, setMapReady] = useState(false);
  const [mapKey, setMapKey] = useState("");

  useEffect(() => {
    setMapKey(Math.random().toString());
    setMapReady(true);
  }, []);

  const { data, error, isLoading } = useSWR('/api/projects', fetcher);
  
  const bornoCenter: [number, number] = [11.83, 13.15]; // Maiduguri approx center

  if (!mapReady) {
    return (
      <div className="w-full h-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">
        Initializing map...
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
      <MapContainer
        key={mapKey}
        center={bornoCenter}
        zoom={8}
        scrollWheelZoom={false}
        className="w-full h-full rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {data?.projects?.map((loc: any) => {
          let color = "#10b981"; // Green
          if (loc.status === "Delayed" || loc.status === "At Risk") color = "#f59e0b";
          if (loc.status === "Critical") color = "#ef4444";

          return (
            <Marker
              key={loc._id}
              position={[loc.coordinates[0], loc.coordinates[1]]}
              icon={createColoredIcon(color)}
            >
              <Popup>
                <div className="font-semibold">{loc.projectId} - {loc.title}</div>
                <div className="text-sm text-slate-500">Status: {loc.status}</div>
                <div className="text-xs text-slate-400 mt-1">{loc.lga} LGA</div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-md shadow text-xs font-semibold tracking-wider text-slate-700 z-[1000] border border-slate-100">
        BORNO STATE MAP
      </div>
    </div>
  );
}
