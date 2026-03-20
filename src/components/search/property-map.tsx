"use client";

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Property } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PropertyMapProps {
  properties: Property[];
  activeId: string | null;
  isExpanded?: boolean;
}

export default function PropertyMap({ properties, activeId, isExpanded }: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<{ [key: string]: maplibregl.Marker }>({});

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          "2gis": {
            type: "raster",
            tiles: ["https://tile1.maps.2gis.com/tiles?x={x}&y={y}&z={z}"],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: "2gis-layer",
            type: "raster",
            source: "2gis",
            minzoom: 0,
            maxzoom: 18,
          },
        ],
      },
      center: [84.9744, 56.4977], // Tomsk
      zoom: 12,
    });

    map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update Markers
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers that aren't in the new properties
    const propertyIds = new Set(properties.map(p => p.id));
    Object.keys(markers.current).forEach(id => {
      if (!propertyIds.has(id)) {
        markers.current[id].remove();
        delete markers.current[id];
      }
    });

    // Add/Update markers
    properties.forEach((property) => {
      if (markers.current[property.id]) {
        // Update existing marker state (active)
        const el = markers.current[property.id].getElement();
        updateMarkerElement(el, property.price, property.id === activeId);
        return;
      }

      const el = document.createElement("div");
      updateMarkerElement(el, property.price, property.id === activeId);

      const marker = new maplibregl.Marker(el)
        .setLngLat([property.lng, property.lat])
        .addTo(map.current!);

      markers.current[property.id] = marker;
    });
  }, [properties, activeId]);

  // Handle side expansion resize
  useEffect(() => {
    if (map.current) {
      setTimeout(() => map.current?.resize(), 500);
    }
  }, [isExpanded]);

  // Center on active property
  useEffect(() => {
    if (activeId && map.current && markers.current[activeId]) {
      const coords = markers.current[activeId].getLngLat();
      map.current.flyTo({ center: coords, zoom: 14, speed: 0.8 });
    }
  }, [activeId]);

  return (
    <div className="w-full h-full relative group">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Search results count overlay (Glassmorphism 2.0) */}
      <div className="absolute top-4 left-4 z-10 hidden lg:block">
        <div className="bg-white/30 backdrop-blur-md border border-white/40 px-4 py-2 rounded-2xl shadow-xl">
          <span className="text-[12px] font-bold text-foreground/80 uppercase tracking-widest">
            Найдено {properties.length} вариантов
          </span>
        </div>
      </div>
    </div>
  );
}

function updateMarkerElement(el: HTMLElement, price: string, isActive: boolean) {
  el.className = cn(
    "flex items-center justify-center px-4 py-1.5 rounded-full border-2 transition-all duration-300 cursor-pointer shadow-xl",
    isActive 
      ? "bg-primary text-white border-white scale-110 z-50 shadow-primary/40 shadow-[0_0_20px_rgba(255,102,0,0.4)]" 
      : "bg-white text-foreground border-transparent hover:scale-105 active:scale-95"
  );
  el.innerHTML = `<span class="text-xs font-bold whitespace-nowrap">${price} ₽</span>`;
}
