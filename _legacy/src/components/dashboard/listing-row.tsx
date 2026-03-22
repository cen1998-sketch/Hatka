"use client";

import { PropertyDetail } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Zap, Calendar, Rocket, Settings, User } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface ListingRowProps {
  listing: PropertyDetail;
}

export function ListingRow({ listing }: ListingRowProps) {
  return (
    <div className="grid grid-cols-[48px_1fr_180px_120px_100px_100px_140px_48px] px-6 py-5 bg-white border-b border-neutral-100 items-center hover:bg-neutral-50 transition-colors">
      <div className="flex justify-center">
        <Checkbox className="rounded-md border-neutral-300" />
      </div>

      <div className="flex items-center gap-4 pl-4">
        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
          {listing.images && listing.images.length > 0 ? (
            <Image 
              src={listing.images[0]} 
              alt={listing.title}
              fill
              className="object-cover"
            />
          ) : (
             <div className="w-5 h-5 bg-white border-2 border-neutral-200 rounded-full flex items-center justify-center">
               <span className="text-[10px] font-bold text-neutral-300">П</span>
             </div>
          )}
          <span className="absolute top-1 left-1 text-white text-[8px] font-bold drop-shadow-sm">№ {listing.id}</span>
        </div>
        <div className="flex flex-col">
          <Link 
            href={listing.status === "active" ? `/property/${listing.id}?preview=true` : `/dashboard/create/hotel?id=${listing.id}`} 
            className="hover:text-blue-600 transition-colors"
          >
            <h3 className="text-neutral-950 text-sm font-bold leading-5">{listing.title}</h3>
          </Link>
          <p className="text-muted-foreground text-xs font-medium leading-4">{listing.location}</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5">
          <div className={cn(
            "w-2 h-2 rounded-full",
            listing.status === "active" ? "bg-green-500" : 
            listing.status === "pending" ? "bg-orange-400" : "bg-neutral-400"
          )} />
          <span className="text-muted-foreground text-[11px] font-bold tracking-tight">
            {listing.status === "active" ? "Опубликовано" : 
             listing.status === "pending" ? "Ожидает размещения" : "Черновик"}
          </span>
        </div>
      </div>

      <div className="flex justify-center flex-col items-center gap-1">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Zap className="w-3.5 h-3.5 fill-neutral-400 text-neutral-400" />
          <span className="text-[10px] font-bold uppercase tracking-tight">выкл</span>
        </div>
      </div>

      <div className="flex justify-center">
        <span className="text-neutral-400 text-base font-semibold">—</span>
      </div>

      <div className="flex justify-center">
        <span className="text-neutral-400 text-base font-semibold">—</span>
      </div>

      <div className="text-right pr-4">
        <p className="text-neutral-950 text-[11px] font-bold leading-4">{listing.lastModified?.split(",")[0]}</p>
        <p className="text-muted-foreground text-[10px] font-medium leading-3">{listing.lastModified?.split(",")[1]}</p>
      </div>

      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-neutral-200 rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-neutral-300">
              <Settings className="w-4 h-4 text-neutral-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 rounded-xl p-1.5 shadow-xl border-neutral-100">
            {listing.status === "active" ? (
              <>
                <DropdownMenuItem className="rounded-lg h-9 px-3 text-xs font-bold text-neutral-700 focus:bg-orange-50 focus:text-orange-600 cursor-pointer">
                  Редактировать
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg h-9 px-3 text-xs font-bold text-neutral-700 focus:bg-orange-50 focus:text-orange-600 cursor-pointer">
                  В черновик
                </DropdownMenuItem>
              </>
            ) : listing.status === "pending" ? (
              <>
                <DropdownMenuItem className="rounded-lg h-9 px-3 text-xs font-bold text-neutral-700 focus:bg-orange-50 focus:text-orange-600 cursor-pointer">
                  Продолжить
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg h-9 px-3 text-xs font-bold text-neutral-700 focus:bg-orange-50 focus:text-orange-600 cursor-pointer">
                  Включить
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg h-9 px-3 text-xs font-bold text-neutral-700 focus:bg-orange-50 focus:text-orange-600 cursor-pointer">
                  В черновик
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem className="rounded-lg h-9 px-3 text-xs font-bold text-neutral-700 focus:bg-orange-50 focus:text-orange-600 cursor-pointer">
                Продолжить
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className="bg-neutral-100" />
            <DropdownMenuItem className="rounded-lg h-9 px-3 text-xs font-bold text-red-500 focus:bg-red-50 focus:text-red-600 cursor-pointer">
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
