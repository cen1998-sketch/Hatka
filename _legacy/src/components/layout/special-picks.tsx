"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SPECIAL_PROPERTIES = [
  { id: "prop-0", title: "Томск, Савиных улица, 4А", price: "3 000", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&q=80" },
  { id: "prop-1", title: "Томск, проспект Ленина, 121", price: "13 000", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&q=80" },
  { id: "prop-2", title: "Томск, улица Кирова, 15", price: "13 000", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=300&q=80" },
  { id: "prop-3", title: "Томск, Комсомольский пр-т", price: "13 000", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&q=80" },
];

export function SpecialPicks() {
  return (
    <div className="w-full flex-shrink-0 flex flex-col gap-1">
      <div className="w-full h-64 p-3 relative bg-teal-500 rounded-xl flex flex-col justify-start items-start gap-3 overflow-hidden shadow-md">
        {/* Banner Background Image */}
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
           <Image 
             src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&q=80"
             alt="Banner BG"
             fill
             className="object-cover"
           />
        </div>

        {/* Header inside banner */}
        <div className="self-stretch inline-flex justify-between items-center z-10">
          <div className="flex justify-start items-center gap-3">
            <h3 className="text-white text-xl font-semibold leading-7">Подобрали специально для вас</h3>
            <span className="text-white/80 text-xl font-semibold leading-7">12 вариантов</span>
          </div>
          <button className="h-8 px-4 py-1 bg-white/40 backdrop-blur-md rounded-xl text-white text-sm font-medium hover:bg-white/50 transition-colors">
            Все
          </button>
        </div>

        {/* Horizontal List of Cards */}
        <div className="self-stretch flex-1 inline-flex justify-start items-start gap-1 z-10 overflow-hidden">
          {SPECIAL_PROPERTIES.map((prop) => (
            <Link key={prop.id} href={`/property/${prop.id}`} className="flex-1 min-w-[150px] h-48 bg-white rounded-lg flex flex-col justify-start items-start overflow-hidden shadow-sm hover:scale-[1.02] transition-transform">
              <div className="relative w-full h-32">
                <Image src={prop.image} alt={prop.title} fill className="object-cover p-2 rounded-xl" />
              </div>
              <div className="self-stretch px-2 py-1 flex flex-col justify-end items-start text-left">
                <div className="self-stretch flex flex-col justify-start items-start gap-0.5">
                  <div className="self-stretch text-neutral-950 text-xs font-semibold leading-5 line-clamp-1">{prop.title}</div>
                </div>
                <div className="inline-flex justify-start items-center gap-1">
                  <div className="text-neutral-950 text-xs font-bold leading-5">{prop.price} ₽</div>
                  <div className="text-neutral-400 text-[10px] font-medium leading-4">за 1 сутки</div>
                </div>
              </div>
            </Link>
          ))}

          {/* Promo Card Block */}
          <div className="w-40 h-48 relative rounded-lg overflow-hidden bg-orange-500 flex flex-col items-center justify-between p-3 shrink-0">
             <div className="w-full text-center text-white text-[14px] font-extrabold uppercase leading-4 mt-1">14 дней премиума</div>
             <div className="text-center text-white text-[9px] font-medium leading-[10px] px-1">
               Делись промокодом с друзьями сейчас!
             </div>
             <div className="w-full h-16 relative">
                 <Image src="https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=200&q=80" alt="Promo" fill className="object-contain" />
             </div>
             <Button size="sm" className="w-full h-8 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-medium">
               Получить
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
