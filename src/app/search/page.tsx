"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { SearchBar } from "@/components/layout/search-bar";
import { PropertyCard } from "@/components/ui/property-card";
import { MOCK_PROPERTIES } from "@/lib/mock-data";
import { FilterBar } from "@/components/search/filter-bar";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamically import Map component to avoid SSR issues with MapLibre
const PropertyMap = dynamic(() => import("@/components/search/property-map"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted animate-pulse rounded-3xl" />,
}) as React.ComponentType<{ properties: any[]; activeId: string | null; isExpanded: boolean }>;

import { SidebarFilters } from "@/components/layout/sidebar-filters";

export default function SearchPage() {
  // Avoid React hydration mismatch by not directly applying Math.random() on render
  const properties = [...MOCK_PROPERTIES]; 
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  return (
    <div className="flex flex-col flex-1 w-full bg-neutral-100 pb-20 items-center overflow-x-hidden">
      {/* Header & Search Area */}
      <div className="w-full transition-all duration-700">
        <SearchBar />
      </div>

      {/* Main Content: Sidebar + Grid + Map */}
      <div className="w-full flex justify-start items-start gap-5">
        
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-28 h-[calc(100vh-140px)] overflow-y-auto no-scrollbar pb-10">
          <SidebarFilters variant="detailed" />
        </aside>

        {/* Central Results Area */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {/* Sorting Bar */}
          <div className="self-stretch h-11 p-0.5 bg-white rounded-2xl flex justify-between items-center shadow-sm">
            <button className="flex-1 h-full bg-gray-200 rounded-2xl text-neutral-950 text-sm font-medium transition-colors">
              По популярности
            </button>
            <button className="flex-1 h-full text-foreground text-sm font-medium hover:bg-gray-100/50 rounded-2xl transition-colors">
              По рейтингу
            </button>
            <button className="flex-1 h-full text-foreground text-sm font-medium hover:bg-gray-100/50 rounded-2xl transition-colors">
              Сначала дешевле
            </button>
          </div>

          <div className="text-black text-base font-normal leading-6 px-1">
            Найдено {properties.length} вариантов жилья из 1 121
          </div>

          <div className={cn(
            "grid gap-4 transition-all duration-700",
            isMapExpanded 
              ? "grid-cols-1" 
              : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3"
          )}>
            {properties.map((property) => (
              <div 
                key={property.id}
                onMouseEnter={() => setHoveredPropertyId(property.id)}
                onMouseLeave={() => setHoveredPropertyId(null)}
                className="w-full"
              >
                <PropertyCard {...property} />
              </div>
            ))}
          </div>

          {/* Load More Trigger Area */}
          <div className="h-px w-full" />
        </div>

        {/* Map Area */}
        <div className={cn(
          "transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) z-10 sticky top-24",
          isMapExpanded 
            ? "flex-1 lg:max-w-none h-[calc(100vh-120px)]" 
            : "hidden xl:block w-[45%] h-[calc(100vh-120px)] max-h-[885px]"
        )}>
          <div className="w-full h-full relative rounded-xl overflow-hidden shadow-sm border border-gray-100 group">
            <PropertyMap 
              properties={properties} 
              activeId={hoveredPropertyId} 
              isExpanded={isMapExpanded}
            />

            {/* Expansion Toggle Button */}
            <button
              onClick={() => setIsMapExpanded(!isMapExpanded)}
              className={cn(
                "absolute top-4 left-4 z-20 flex items-center gap-1.5 h-11 px-4 rounded-2xl shadow-xl transition-all",
                "bg-white text-foreground hover:bg-gray-50",
                "active:scale-95"
              )}
            >
              <Maximize2 className="w-4 h-4" />
              <span className="text-sm font-medium leading-5">
                {isMapExpanded ? "Свернуть карту" : "Раскрыть карту"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
