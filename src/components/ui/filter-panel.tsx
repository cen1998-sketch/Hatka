"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const HOUSING_TYPES = [
  { id: "apartments", label: "квартиры, апартаменты" },
  { id: "houses", label: "дома, коттеджи" },
  { id: "rooms", label: "комнаты" },
  { id: "hostels", label: "хостелы" },
  { id: "hotels", label: "отели" },
  { id: "mini-hotels", label: "мини-гостиницы" },
  { id: "guest-houses", label: "гостевые дома" },
  { id: "apart-hotels", label: "апарт-отели" },
];

interface FilterPanelProps {
  className?: string;
}

function FilterPanel({ className }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getInitialTypes = () => {
    const param = searchParams.get("types");
    if (!param) return { apartments: true };
    const arr = param.split(",");
    const obj: Record<string, boolean> = {};
    arr.forEach((t) => (obj[t] = true));
    return obj;
  };

  const [checkedTypes, setCheckedTypes] = React.useState<Record<string, boolean>>(
    getInitialTypes
  );
  const [instantBooking, setInstantBooking] = React.useState(
    searchParams.get("instant") === "false" ? false : true
  );
  const [priceRange, setPriceRange] = React.useState([
    parseInt(searchParams.get("minPrice") || "0"),
    parseInt(searchParams.get("maxPrice") || "20000"),
  ]);

  const toggleType = (id: string) => {
    setCheckedTypes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    const selectedTypes = Object.entries(checkedTypes)
      .filter(([_, v]) => v)
      .map(([k]) => k)
      .join(",");
    
    if (selectedTypes) params.set("types", selectedTypes);
    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());
    params.set("instant", instantBooking.toString());

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div
      className={cn(
        "w-72 p-6 bg-white rounded-xl flex flex-col justify-start items-start gap-5 overflow-hidden sticky top-[40px] h-fit",
        "shadow-sm",
        className
      )}
    >
      <div className="self-stretch justify-start text-black text-base font-semibold font-['NT_Somic'] leading-6">
        Выбирайте лучшее
      </div>

      <div className="self-stretch flex justify-start items-start">
        <div className="flex-1 flex flex-col justify-start items-start">
          <Label
            htmlFor="instant-booking"
            className="self-stretch justify-start text-black text-base font-normal font-['NT_Somic'] leading-6 cursor-pointer"
          >
            Быстрое бронирование
          </Label>
          <div className="self-stretch justify-start text-muted-foreground text-xs font-medium font-['NT_Somic'] leading-4 mt-0.5">
            Всего 2 минуты, без ожидания ответа от хозяина
          </div>
        </div>
        <div className="flex justify-start items-center">
          <div className="pr-2 flex flex-col justify-start items-start gap-2.5">
            <Switch
              id="instant-booking"
              checked={instantBooking}
              onCheckedChange={setInstantBooking}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-start items-start gap-3 w-full">
        {HOUSING_TYPES.map((type) => (
          <div key={type.id} className="flex justify-start items-end gap-3 w-full">
            <Checkbox
              id={type.id}
              checked={!!checkedTypes[type.id]}
              onCheckedChange={() => toggleType(type.id)}
            />
            <Label
              htmlFor={type.id}
              className="flex justify-center items-center gap-2.5 text-foreground text-sm font-medium font-['NT_Somic'] leading-5 cursor-pointer pb-0.5"
            >
              {type.label}
            </Label>
          </div>
        ))}
      </div>

      <div className="self-stretch flex flex-col justify-start items-start gap-3">
        <div className="self-stretch justify-start text-black text-base font-semibold font-['NT_Somic'] leading-6">
          Цена за сутки
        </div>
        <div className="self-stretch flex justify-start items-center gap-1.5">
          <div className="flex-1 h-11 px-4 py-2 bg-background rounded-2xl border border-border flex justify-between items-center overflow-hidden">
            <div className="justify-start text-muted-foreground text-sm font-medium font-['NT_Somic'] leading-5">
              {priceRange[0].toLocaleString()}
            </div>
            <div className="justify-start text-foreground text-sm font-medium font-['NT_Somic'] leading-5">
              ₽
            </div>
          </div>
          <div className="justify-start text-foreground text-sm font-medium font-['NT_Somic'] leading-5">
            —
          </div>
          <div className="flex-1 h-11 px-4 py-2 bg-background rounded-2xl border border-border flex justify-between items-center overflow-hidden">
            <div className="justify-start text-foreground text-sm font-medium font-['NT_Somic'] leading-5">
              {priceRange[1].toLocaleString() + (priceRange[1] >= 50000 ? " +" : "")}
            </div>
            <div className="justify-start text-foreground text-sm font-medium font-['NT_Somic'] leading-5">
              ₽
            </div>
          </div>
        </div>
        
        <Slider
          value={priceRange}
          max={50000}
          min={0}
          step={500}
          onValueChange={setPriceRange}
          className="mt-2 w-full"
        />
      </div>

      <Button
        onClick={handleSearch}
        className="w-full h-11 px-4 bg-neutral-950 rounded-2xl flex justify-center items-center gap-1.5 font-['NT_Somic'] text-white hover:bg-neutral-800 transition-colors"
      >
        <span className="justify-start text-white text-sm font-medium font-['NT_Somic'] leading-5">
           Показать варианты
        </span>
      </Button>
    </div>
  );
}

FilterPanel.displayName = "FilterPanel";

export { FilterPanel };
export type { FilterPanelProps };
