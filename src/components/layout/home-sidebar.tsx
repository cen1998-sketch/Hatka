"use client";

import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const HOUSING_TYPES = [
  { id: "apt", label: "квартиры, апартаменты", checked: true },
  { id: "house", label: "дома, коттеджи" },
  { id: "room", label: "комнаты" },
  { id: "hostel", label: "хостелы" },
  { id: "hotel", label: "отели" },
  { id: "mini", label: "мини-гостиницы" },
  { id: "guest", label: "гостевые дома" },
  { id: "aparthotel", label: "апарт-отели" },
];

export function HomeSidebarFilters() {
  return (
    <div className="w-72 p-6 bg-white rounded-xl flex flex-col justify-start items-start gap-5 overflow-hidden shadow-sm">
      <div className="self-stretch justify-start text-black text-base font-semibold leading-6">
        Выбирайте лучшее
      </div>
      
      {/* Быстрое бронирование */}
      <div className="self-stretch inline-flex justify-start items-start">
        <div className="flex-1 inline-flex flex-col justify-start items-start">
          <div className="self-stretch justify-start text-black text-base font-normal leading-6">
            Быстрое бронирование
          </div>
          <div className="self-stretch justify-start text-muted-foreground text-xs font-medium leading-4">
            Всего 2 минуты, без ожидания ответа от хозяина
          </div>
        </div>
        <div className="flex justify-start items-center">
          <div className="pr-2 inline-flex flex-col justify-start items-start gap-2.5">
            <Switch defaultChecked className="bg-orange-500" />
          </div>
        </div>
      </div>

      {/* Типы жилья */}
      <div className="flex flex-col justify-start items-start gap-3">
        {HOUSING_TYPES.map((type) => (
          <div key={type.id} className="inline-flex justify-start items-end gap-3 cursor-pointer group">
            <Checkbox id={type.id} defaultChecked={type.checked} className="w-4 h-4 border-gray-200" />
            <div className="flex justify-center items-center gap-2.5">
              <label htmlFor={type.id} className="justify-start text-foreground text-sm font-medium leading-5 cursor-pointer">
                {type.label}
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Цена за сутки */}
      <div className="self-stretch flex flex-col justify-start items-start gap-3">
        <div className="self-stretch justify-start text-black text-base font-semibold leading-6 pt-2">
          Цена за сутки
        </div>
        <div className="self-stretch inline-flex justify-start items-center gap-1.5">
          <div className="flex-1 h-11 px-4 py-2 bg-background rounded-2xl border border-gray-100 flex justify-between items-center overflow-hidden shadow-sm">
            <span className="text-foreground text-sm font-medium">2 500</span>
            <span className="text-foreground text-sm font-medium">₽</span>
          </div>
          <div className="justify-start text-foreground text-sm font-medium leading-5">—</div>
          <div className="flex-1 h-11 px-4 py-2 bg-background rounded-2xl border border-gray-100 flex justify-between items-center overflow-hidden shadow-sm">
            <span className="text-muted-foreground text-sm font-medium">20 000 +</span>
            <span className="text-foreground text-sm font-medium">₽</span>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="self-stretch px-1">
        <Slider defaultValue={[20, 80]} max={100} step={1} className="mt-1" />
      </div>

      {/* Button */}
      <div className="self-stretch pt-2">
        <Button className="w-full h-11 bg-neutral-950 hover:bg-neutral-800 text-white rounded-2xl text-sm font-medium shadow-lg transition-all">
          Показать варианты
        </Button>
      </div>
    </div>
  );
}
