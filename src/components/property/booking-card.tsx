"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Zap } from "lucide-react";

interface BookingCardProps {
  price: string;
  basePrice: number;
  cancelation: {
    title: string;
    deadline: string;
    description: string;
  };
}

export function BookingCard({ price, basePrice, cancelation }: BookingCardProps) {
  return (
    <div className="w-full p-6 bg-white rounded-xl flex flex-col gap-5 shadow-sm">
      {/* Price Header */}
      <div className="flex items-baseline gap-2">
        <span className="text-neutral-950 text-3xl font-semibold leading-9">{price}</span>
        <span className="text-neutral-400 text-base font-semibold leading-6">за 1 сутки</span>
      </div>

      {/* Date & Guest Inputs */}
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <div className="flex-1 h-11 px-4 py-2 bg-gray-100 rounded-2xl flex flex-col justify-center">
            <span className="text-muted-foreground text-[10px] font-medium leading-3 uppercase tracking-tight">Заезд</span>
            <span className="text-foreground text-sm font-medium leading-5">19 июн, пт</span>
          </div>
          <div className="flex-1 h-11 px-4 py-2 bg-gray-100 rounded-2xl flex flex-col justify-center">
            <span className="text-muted-foreground text-[10px] font-medium leading-3 uppercase tracking-tight">Отъезд</span>
            <span className="text-foreground text-sm font-medium leading-5">27 июн, сб</span>
          </div>
        </div>
        <div className="h-11 px-4 py-2 bg-gray-100 rounded-2xl flex items-center justify-between">
          <div className="flex flex-col justify-center">
            <span className="text-muted-foreground text-[10px] font-medium leading-3 uppercase tracking-tight">Гости</span>
            <span className="text-foreground text-sm font-medium leading-5">2 взрослых без детей</span>
          </div>
          <ChevronDown className="w-4 h-4 text-neutral-400" />
        </div>
      </div>

      {/* Cancelation Info */}
      <div className="flex flex-col gap-1">
        <h3 className="text-black text-base font-semibold leading-6">{cancelation.title}</h3>
        <p className="text-muted-foreground text-xs font-medium leading-4">
          {cancelation.deadline}
          <br />
          {cancelation.description}
        </p>
        <button className="text-orange-500 text-xs font-medium hover:underline text-left mt-1">
          Правила отмены
        </button>
      </div>

      {/* Booking Button */}
      <div className="flex flex-col gap-2">
        <Button className="w-full h-11 bg-neutral-950 text-white rounded-2xl hover:bg-neutral-800 flex items-center gap-1.5 border-none">
          <Zap className="w-4 h-4 fill-white text-white" />
          <span className="text-sm font-medium">Забронировать</span>
        </Button>
        <p className="text-center text-muted-foreground text-xs font-medium leading-4">
          13 312 ₽ оплатить сейчас – остальное при заселении
        </p>
      </div>
    </div>
  );
}
