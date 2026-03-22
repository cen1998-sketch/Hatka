"use client";

import { LogIn, LogOut, Crosshair, ChevronRight, FileText, Ban } from "lucide-react";

interface StayDetailsCardProps {
  rules: {
    checkIn: string;
    checkOut: string;
  };
}

export function StayDetailsCard({ rules }: StayDetailsCardProps) {
  return (
    <div className="w-full p-6 bg-white rounded-xl flex flex-col gap-6">
      <h2 className="text-neutral-950 text-xl font-semibold leading-7">Детали проживания</h2>
      
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <LogIn className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-tight">Время заезда</span>
              <span className="text-neutral-950 text-sm font-semibold leading-5">после {rules.checkIn}</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
        </div>

        <div className="flex items-center justify-between group cursor-pointer border-t border-gray-50 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <LogOut className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-tight">Время отъезда</span>
              <span className="text-neutral-950 text-sm font-semibold leading-5">до {rules.checkOut}</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
        </div>

        <div className="flex items-center justify-between group cursor-pointer border-t border-gray-50 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Crosshair className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-tight">Цель заезда (необязательно)</span>
              <span className="text-neutral-950 text-sm font-semibold leading-5 text-muted-foreground">Не указана</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
        </div>
      </div>

      {/* Rules Summary Card */}
      <div className="p-4 bg-gray-100 rounded-xl flex flex-col gap-3">
        <h3 className="text-neutral-950 text-base font-semibold leading-6">Правила проживания</h3>
        <div className="flex flex-col gap-1.5 text-neutral-950 text-xs font-medium leading-4">
          <p>Можно с детьми любого возраста</p>
          <p>Курение запрещено</p>
          <button className="text-neutral-950 flex items-center gap-1 hover:underline mt-1">
            <span>Все правила</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between group cursor-pointer border-t border-gray-50 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Ban className="w-4 h-4 text-neutral-400" />
            </div>
            <span className="text-neutral-950 text-sm font-semibold">Условия отмены</span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
        </div>

        <div className="flex items-center justify-between group cursor-pointer border-t border-gray-50 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="w-4 h-4 text-neutral-400" />
            </div>
            <span className="text-neutral-950 text-sm font-semibold">Документы для бухгалтерии</span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
        </div>
      </div>
    </div>
  );
}
