"use client";

import { PropertyDetail } from "@/lib/types";
import Image from "next/image";
import { Star } from "lucide-react";

interface CheckoutPropertyCardProps {
  property: PropertyDetail;
}

export function CheckoutPropertyCard({ property }: CheckoutPropertyCardProps) {
  return (
    <div className="w-full p-4 bg-white rounded-xl flex items-start gap-4">
      <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
        <Image 
          src={property.images[0]} 
          alt={property.title}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-md uppercase tracking-wider">
            Суперхозяин
          </span>
        </div>
        <h2 className="text-neutral-950 text-base font-semibold leading-6">{property.title}</h2>
        <p className="text-muted-foreground text-xs font-medium leading-4">Томск, Савиных улица, 4А</p>
        
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1">
            <div className="w-7 h-5 bg-green-600 rounded-md flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">9.8</span>
            </div>
            <span className="text-muted-foreground text-xs font-medium">(102 отзыва)</span>
          </div>
        </div>
      </div>
      
      <button className="px-3 py-1.5 bg-gray-100 rounded-lg text-neutral-950 text-[10px] font-bold uppercase tracking-tight self-end">
        Выбор гостей
      </button>
    </div>
  );
}
