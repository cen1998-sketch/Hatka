"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/use-favorites";

export interface PropertyCardProps {
  id?: string;
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

export function PropertyScore({ rating, reviews }: { rating: string | number, reviews: string | number }) {
  return (
    <div className="h-6 flex justify-start items-center gap-1 z-20">
      <div className="h-6 pl-2.5 pr-1.5 pt-1 pb-[5px] bg-amber-500/40 rounded-tl-[10px] rounded-tr-sm rounded-bl-[10px] rounded-br-sm flex justify-start items-center gap-1">
        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        <div className="justify-start text-white text-xs font-medium font-['NT_Somic'] leading-4">{rating}</div>
      </div>
      <div className="h-6 pl-1.5 pr-2.5 pt-1 pb-[5px] bg-white/40 rounded-tl-sm rounded-tr-[10px] rounded-bl-sm rounded-br-[10px] flex justify-start items-center gap-1">
        <div className="justify-start text-white text-xs font-medium font-['NT_Somic'] leading-4">{reviews} шт</div>
      </div>
    </div>
  );
}

export function PropertyCard({
  id,
  image,
  title,
  price,
  rating,
  reviews,
  location,
  specs,
  className,
}: PropertyCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [favorite, setFavorite] = React.useState(false);

  // Avoid hydration mismatch by syncing states after mount
  React.useEffect(() => {
    if (id) {
      setFavorite(isFavorite(id));
      const handleSync = () => setFavorite(isFavorite(id));
      window.addEventListener('favorites-updated', handleSync);
      return () => window.removeEventListener('favorites-updated', handleSync);
    }
  }, [id, isFavorite]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (id) {
      toggleFavorite(id);
      setFavorite(!favorite);
    }
  };

  const cardContent = (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden group w-full aspect-[4/3] flex flex-col justify-end items-start",
        id && "cursor-pointer",
        className
      )}
    >
      <div className="self-stretch h-full relative rounded-xl overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>

        {/* Top Gradient */}
        <div className="absolute left-0 top-0 w-full h-[80px] bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none"></div>
        
        {/* Top Left Tag */}
        <div className="absolute left-3 top-3 z-20 px-2.5 pt-1 pb-[5px] bg-white/40 backdrop-blur-md rounded-[10px] inline-flex items-center gap-1 border border-white/20 shadow-sm pointer-events-none">
          <CheckCircle className="w-3 h-3 text-white" />
          <span className="text-white text-xs font-medium font-['NT_Somic'] leading-4">{location}</span>
        </div>

        {/* Like Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 z-20 p-2 hover:scale-110 active:scale-95 transition-all outline outline-1 outline-offset-[-0.5px] outline-transparent rounded-full"
        >
          <Heart className={cn("w-6 h-6 transition-colors", favorite ? "fill-red-500 text-red-500" : "text-white")} />
        </button>

        {/* Bottom Gradient */}
        <div className="absolute left-0 bottom-0 w-full h-[140px] bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none"></div>

        {/* Bottom Content Area */}
        <div className="absolute left-3 right-3 bottom-3 z-20 flex flex-col justify-end items-start gap-1 pointer-events-none">
          <div className="self-stretch flex flex-col justify-start items-start gap-0.5">
            <h3 className="self-stretch justify-start text-white text-xl font-semibold font-['NT_Somic'] leading-7 truncate">
              {title}
            </h3>
            <div className="self-stretch flex flex-wrap justify-start items-start gap-1">
              {Object.values(specs).map((val, i) => (
                <div
                  key={i}
                  className="px-2 pt-0.5 pb-[3px] bg-white/40 backdrop-blur-md rounded-md inline-flex items-center gap-2.5"
                >
                  <span className="text-white text-xs font-medium font-['NT_Somic'] leading-4">
                    {val.includes('м2') || val.includes('м²') ? (
                      <>{parseFloat(val)}м<sup>2</sup></>
                    ) : (
                      val
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="self-stretch flex justify-between items-center mt-1">
            <div className="flex justify-start items-center gap-2">
              <div className="text-white text-xl font-semibold font-['NT_Somic'] leading-7">{price} ₽</div>
              <div className="text-neutral-400 text-sm font-medium font-['NT_Somic'] leading-5">за 1 сутки</div>
            </div>
            <PropertyScore rating={rating} reviews={reviews} />
          </div>
        </div>
      </div>
    </div>
  );

  if (id) {
    return <Link href={`/property/${id}`} className="w-full block">{cardContent}</Link>;
  }

  return cardContent;
}

PropertyCard.displayName = "PropertyCard";
