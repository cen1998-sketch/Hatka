"use client";

import { ChevronLeft, ChevronRight, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyGalleryProps {
  images: string[];
  location: string;
}

export function PropertyGallery({ images, location }: PropertyGalleryProps) {
  return (
    <div className="relative w-full h-96 rounded-xl overflow-hidden group">
      {/* Main Image */}
      <div 
        className="w-full h-full bg-cover bg-center transition-transform duration-500"
        style={{ backgroundImage: `url(${images[0]})` }}
      />

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1">
        <div className="w-[3px] h-[3px] opacity-20 bg-white rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        <div className="w-1.5 h-1.5 opacity-20 bg-white rounded-full"></div>
        <div className="w-[3px] h-[3px] opacity-20 bg-white rounded-full"></div>
      </div>

      {/* Location Badge */}
      <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/40 backdrop-blur-md rounded-[10px] flex items-center gap-1">
        <Square className="w-3 h-3 text-white fill-white" />
        <span className="text-white text-xs font-medium font-['NT_Somic']">
          {location}
        </span>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-11 w-11 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/40">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-11 w-11 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/40">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
