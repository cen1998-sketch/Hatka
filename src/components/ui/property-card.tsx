"use client";

import * as React from "react";
import Image from "next/image";
import { Heart, Star, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PropertyCardProps {
  image: string;
  title: string;
  price: string;
  rating: string;
  reviews: string;
  location: string;
  specs: {
    guests: string;
    beds: string;
    area: string;
  };
  className?: string;
}

export function PropertyCard({
  image,
  title,
  price,
  rating,
  reviews,
  location,
  specs,
  className,
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = React.useState(false);

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden group w-full aspect-[4/3]",
        className
      )}
    >
      {/* Image Section */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      </div>

      {/* Heart icon */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsFavorite(!isFavorite);
        }}
        className={cn(
          "absolute top-3 right-3 p-1.5 rounded-full z-20",
          "bg-black/10 hover:bg-black/20 text-white transition-all shadow-sm"
        )}
      >
        <Heart
          className={cn(
            "w-5 h-5 transition-colors",
            isFavorite ? "fill-red-500 text-red-500" : "text-white"
          )}
        />
      </button>

      {/* Location badge */}
      <div className="absolute top-3 left-3 z-20">
        <div className="flex items-center gap-1 bg-white/40 backdrop-blur-md px-2.5 py-1 rounded-[10px] border border-white/20 shadow-sm">
          <CheckCircle className="w-3 h-3 text-white" />
          <span className="text-white text-xs font-medium">{location}</span>
        </div>
      </div>

      {/* Bottom Overlay Container - Match "Variant6" */}
      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-[1.5px] p-3 flex flex-col justify-end gap-1 z-10">
        {/* Title & Specs */}
        <div className="flex flex-col gap-0.5">
          <h3 className="text-white text-lg font-semibold leading-7 truncate drop-shadow-sm">
            {title}
          </h3>
          <div className="flex items-center gap-1">
            {Object.values(specs).map((val, i) => (
              <div
                key={i}
                className="px-2 py-0.5 bg-white/40 rounded-md text-white text-[10px] font-medium"
              >
                {val}
              </div>
            ))}
          </div>
        </div>

        {/* Price & Rating Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-white text-xl font-semibold leading-7">
              {price} ₽
            </span>
            <span className="text-neutral-400 text-sm font-medium leading-5">
              за 1 сутки
            </span>
          </div>

          <div className="h-6 flex items-center bg-white/20 rounded-[10px] overflow-hidden">
            <div className="h-full pl-2.5 pr-1.5 bg-amber-500/40 flex items-center gap-1 rounded-l-[10px]">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-xs font-medium">9,8</span>
            </div>
            <div className="h-full pl-1.5 pr-2.5 bg-white/40 flex items-center rounded-r-[10px]">
              <span className="text-white text-xs font-medium">{reviews} шт</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

PropertyCard.displayName = "PropertyCard";
