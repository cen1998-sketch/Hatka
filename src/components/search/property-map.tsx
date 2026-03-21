"use client";

import React, { useEffect, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Property } from "@/lib/types";

interface PropertyMapProps {
  properties: Property[];
  activeId: string | null;
  isExpanded?: boolean;
}

export default function PropertyMap({ properties, activeId, isExpanded }: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const mapReady = useRef(false);
  const markers = useRef<{ [key: string]: maplibregl.Marker }>({});

  // Stable function to sync markers
  const syncMarkers = useCallback(() => {
    if (!map.current || !mapReady.current) return;

    // Clear markers that are no longer in properties
    const propertyIds = new Set(properties.map(p => p.id));
    Object.keys(markers.current).forEach(id => {
      if (!propertyIds.has(id)) {
        markers.current[id].remove();
        delete markers.current[id];
      }
    });

    // Add or update markers
    properties.forEach((property) => {
      if (markers.current[property.id]) {
        // Update existing marker (highlight state)
        const el = markers.current[property.id].getElement();
        const inner = el.querySelector(".price-tag") as HTMLElement;
        if (inner) {
          applyActiveStyle(inner, property.id === activeId);
        }
        return;
      }

      // Create new marker element
      const el = document.createElement("div");
      el.style.cursor = "pointer";

      const inner = document.createElement("div");
      inner.className = "price-tag";
      applyActiveStyle(inner, property.id === activeId);

      // Format price
      const rawPrice = property.price;
      const numPrice = typeof rawPrice === "string" ? Number(rawPrice.replace(/\D/g, "")) : Number(rawPrice);
      const formatted = !isNaN(numPrice) && numPrice > 0
        ? new Intl.NumberFormat("ru-RU").format(numPrice) + " ₽"
        : rawPrice + " ₽";

      inner.textContent = formatted;
      el.appendChild(inner);

      // Click → navigate to property detail
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        window.location.href = `/property/${property.id}`;
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([property.lng, property.lat])
        .addTo(map.current!);

      markers.current[property.id] = marker;
    });
  }, [properties, activeId]);

  // Init map
  useEffect(() => {
    if (!mapContainer.current) return;

    const m = new maplibregl.Map({
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

    m.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    m.on("load", () => {
      mapReady.current = true;
      syncMarkers();
    });

    map.current = m;

    return () => {
      mapReady.current = false;
      Object.values(markers.current).forEach(mk => mk.remove());
      markers.current = {};
      m.remove();
      map.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync markers whenever properties or activeId change
  useEffect(() => {
    syncMarkers();
  }, [syncMarkers]);

  // Handle side expansion resize
  useEffect(() => {
    if (map.current) {
      setTimeout(() => map.current?.resize(), 500);
    }
  }, [isExpanded]);

  return (
    <div className="w-full h-full relative group">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Search results count overlay */}
      <div className="absolute top-4 left-4 z-10 hidden lg:block">
        <div className="bg-white/30 backdrop-blur-md border border-white/40 px-4 py-2 rounded-2xl shadow-xl">
          <span className="text-[12px] font-bold text-foreground/80 uppercase tracking-widest">
            Найдено {properties.length} вариантов
          </span>
        </div>
      </div>

      {/* Inline styles for price tags (guaranteed to work, no Tailwind dependency) */}
      <style jsx global>{`
        .price-tag {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px 14px;
          border-radius: 999px;
          border: 2px solid transparent;
          background: white;
          color: #1a1a1a;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .price-tag:hover {
          transform: scale(1.05);
        }
        .price-tag.active {
          color: #f97316;
          border-color: #f97316;
          transform: scale(1.1);
          box-shadow: 0 0 0 3px rgba(249,115,22,0.3), 0 4px 12px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}

function applyActiveStyle(el: HTMLElement, isActive: boolean) {
  if (isActive) {
    el.classList.add("active");
  } else {
    el.classList.remove("active");
  }
}
