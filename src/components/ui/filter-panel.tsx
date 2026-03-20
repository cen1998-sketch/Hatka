"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  onSearch?: () => void;
}

function FilterPanel({ className, onSearch }: FilterPanelProps) {
  const [priceRange, setPriceRange] = React.useState([2500, 20000]);
  const [checkedTypes, setCheckedTypes] = React.useState<Record<string, boolean>>({
    apartments: true,
  });

  const toggleType = (id: string) => {
    setCheckedTypes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      className={cn(
        "rounded-2xl bg-white shadow-sm overflow-hidden",
        className
      )}
    >
      <div className="p-6 flex flex-col gap-6">
        {/* Быстрое бронирование */}
        <div className="flex flex-col gap-2">
          <span className="text-base font-semibold text-foreground">
            Выбирайте лучшее
          </span>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="instant-booking" className="text-base font-normal text-foreground cursor-pointer">
                Быстрое бронирование
              </Label>
              <span className="text-xs font-medium text-muted-foreground">
                Всего 2 минуты, без ожидания ответа от хозяина
              </span>
            </div>
            <Switch id="instant-booking" defaultChecked />
          </div>
        </div>

        {/* Тип жилья */}
        <div className="flex flex-col gap-3">
          {HOUSING_TYPES.map((type) => (
            <div key={type.id} className="flex items-center space-x-2.5">
              <Checkbox
                id={type.id}
                checked={!!checkedTypes[type.id]}
                onCheckedChange={() => toggleType(type.id)}
              />
              <Label
                htmlFor={type.id}
                className="text-sm font-medium leading-none cursor-pointer text-foreground"
              >
                {type.label}
              </Label>
            </div>
          ))}
        </div>

        {/* Цена за сутки */}
        <div className="flex flex-col gap-3">
          <span className="text-base font-semibold text-foreground">
            Цена за сутки
          </span>
          <div className="flex items-center gap-2.5">
            <div className="flex-1 bg-white rounded-2xl px-4 py-2.5 text-sm font-medium text-foreground border border-gray-200/80 flex items-center justify-between">
              <span>{priceRange[0].toLocaleString()}</span>
              <span className="text-foreground">₽</span>
            </div>
            <span className="text-sm font-medium text-foreground">—</span>
            <div className="flex-1 bg-white rounded-2xl px-4 py-2.5 text-sm font-medium text-muted-foreground border border-gray-200/80 flex items-center justify-between">
              <span>{priceRange[1].toLocaleString()} +</span>
              <span className="text-foreground">₽</span>
            </div>
          </div>
          <Slider
            defaultValue={[2500, 20000]}
            max={50000}
            min={500}
            step={500}
            onValueChange={setPriceRange}
            className="mt-1"
          />
        </div>

        {/* Показать варианты */}
        <Button
          onClick={onSearch}
          className={cn(
            "w-full rounded-2xl h-12 text-sm font-medium",
            "bg-foreground text-background",
            "hover:bg-foreground/90 hover:scale-[1.01]",
            "active:bg-foreground/80 active:scale-[0.99]",
            "transition-all duration-200"
          )}
        >
          Показать варианты
        </Button>
      </div>
    </div>
  );
}

FilterPanel.displayName = "FilterPanel";

export { FilterPanel };
export type { FilterPanelProps };
