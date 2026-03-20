"use client";

import { MapPin, Zap } from "lucide-react";
import Image from "next/image";

interface PropertyHeaderProps {
  title: string;
  tags: string[];
}

export function PropertyHeader({ title, tags }: PropertyHeaderProps) {
  return (
    <div className="w-full p-6 bg-white rounded-xl flex flex-col gap-5">
      {/* Title and Tags */}
      <div className="flex flex-col gap-2">
        <h1 className="text-neutral-950 text-xl font-semibold leading-7">{title}</h1>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, i) => (
            <div 
              key={i} 
              className="px-4 py-1.5 bg-gray-200 rounded-xl text-neutral-950 text-xs font-medium"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Info Blocks */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 p-3 bg-gray-100 rounded-lg flex items-center gap-3">
          <div className="w-14 h-14 bg-white rounded-md flex items-center justify-center shadow-sm">
            <Zap className="w-8 h-8 text-orange-400 fill-orange-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-black text-base font-semibold">Быстрое бронирование</h3>
            <p className="text-muted-foreground text-xs font-medium leading-4">
              Всего 2 минуты, без ожидания ответа от хозяина, будет доступно после авторизации
            </p>
          </div>
        </div>

        <div className="flex-1 p-3 bg-gray-100 rounded-lg flex items-center gap-3">
          <div className="w-14 h-14 bg-white rounded-md flex items-center justify-center shadow-sm">
            <MapPin className="w-8 h-8 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-black text-base font-semibold">Посмотреть на карте</h3>
            <p className="text-muted-foreground text-xs font-medium leading-4">
              Уютный район и точный адрес. Кликни карту — покажем всё сверху наглядно!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
