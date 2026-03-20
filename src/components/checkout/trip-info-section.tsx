"use client";

import { Calendar, Users, ChevronRight } from "lucide-react";

export function TripInfoSection() {
  return (
    <div className="w-full p-6 bg-white rounded-xl flex flex-col gap-5">
      <h2 className="text-neutral-950 text-xl font-semibold leading-7">Информация о поездке</h2>
      
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-tight">Даты заезда и отъезда</span>
              <span className="text-neutral-950 text-sm font-semibold leading-5">2 апр, чт - 26 апр, вс</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
        </div>

        <div className="flex items-center justify-between group cursor-pointer border-t border-gray-50 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-tight">Гости</span>
              <span className="text-neutral-950 text-sm font-semibold leading-5">2 взрослых, без детей и питомцев</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
        </div>
      </div>
    </div>
  );
}
