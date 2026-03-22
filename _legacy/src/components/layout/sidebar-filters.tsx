"use client";

import * as React from "react";
import { FilterGroup } from "@/components/search/filter-group";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const HOUSING_TYPES = [
  { id: "apartments", label: "Квартиры, апартаменты" },
  { id: "houses", label: "Дома, коттеджи" },
  { id: "rooms", label: "Комнаты" },
  { id: "hotels", label: "Отели, гостиницы" },
  { id: "apart-hotels", label: "Апарт-отели" },
  { id: "mini-hotels", label: "Мини-гостиницы" },
  { id: "guest-houses", label: "Гостевые дома" },
  { id: "glamping", label: "Глэмпинги, базы отдыха" },
  { id: "hostels", label: "Хостелы" },
  { id: "studios", label: "Студии" }
];

const AMENITIES = [
  "Интернет Wi-Fi", "Кондиционер", "Кухня", "Холодильник", "Балкон, лоджия",
  "Детская кроватка", "Стиральная машина", "Телевизор", "Электрочайник",
  "Посуда и принадлежности", "Микроволновая печь", "Духовка", "Полотенца",
  "Утюг с гладильной доской", "Фен", "Джакузи", "Сауна, баня", "Камин",
  "Посудомоечная машина", "Мультиварка", "Терраса", "Водонагреватель"
];

const ON_SITE = ["Парковка", "Беседка", "Мангал", "Бассейн", "Детская площадка"];
const VIEWS = ["На море", "На горы", "На реку, озеро", "На город"];
const RULES = ["Курение разрешено", "Вечеринки разрешены", "Заселение без депозита"];
const BATHROOMS = ["Своя ванная команата", "Свой туалет", "Свой душ"];
const DINING = ["Завтрак", "Обед", "Ужин"];
const EXTRA = ["Быстро отвечают", "Трансфер", "Ранний заезд разрешен", "Поздний отъезд разрешен", "Предоплата 100%", "Отчётные документы"];

interface SidebarFiltersProps {
  variant?: "simple" | "detailed";
}

export function SidebarFilters({ variant = "detailed" }: SidebarFiltersProps) {
  const isDetailed = variant === "detailed";
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

  const [checkedTypes, setCheckedTypes] = React.useState<Record<string, boolean>>(getInitialTypes);
  const [instantBooking, setInstantBooking] = React.useState(
    searchParams.get("instant") === "false" ? false : true
  );
  const [priceRange, setPriceRange] = React.useState([
    parseInt(searchParams.get("minPrice") || "0"),
    parseInt(searchParams.get("maxPrice") || "20000"),
  ]);
  
  // New States
  const [showAllAmenities, setShowAllAmenities] = React.useState(false);
  const [selectedBedrooms, setSelectedBedrooms] = React.useState<string[]>([]);
  const [selectedFloorChips, setSelectedFloorChips] = React.useState<string[]>([]);
  const [selectedStars, setSelectedStars] = React.useState<string[]>([]);
  const [areaRange, setAreaRange] = React.useState(["", ""]);
  const [floorRange, setFloorRange] = React.useState(["", ""]);
  const [checkedFeatures, setCheckedFeatures] = React.useState<Record<string, boolean>>({});

  // Computed state for active filters
  const hasActiveFilters = 
    (Object.keys(checkedTypes).length > 0 && !checkedTypes.apartments) ||
    Object.keys(checkedTypes).length > 1 ||
    !checkedTypes.apartments && Object.keys(checkedTypes).length === 0 || // unselected apartments
    !instantBooking ||
    priceRange[0] !== 0 || priceRange[1] !== 20000 ||
    selectedBedrooms.length > 0 ||
    selectedFloorChips.length > 0 ||
    selectedStars.length > 0 ||
    areaRange[0] !== "" || areaRange[1] !== "" ||
    floorRange[0] !== "" || floorRange[1] !== "" ||
    Object.values(checkedFeatures).some(v => v === true);

  // Handle URL updates immediately when any filter changes to apply them to /search
  const updateURL = (types: Record<string, boolean>, instant: boolean, price: number[]) => {
    // Note: To be fully functional with new states, you'd serialize them to URL here as well.
    // For now, mirroring previous logic plus showing that it updates.
    const params = new URLSearchParams(searchParams.toString());
    const selectedTypes = Object.entries(types)
      .filter(([_, v]) => v)
      .map(([k]) => k)
      .join(",");
      
    if (selectedTypes) params.set("types", selectedTypes);
    else params.delete("types");
    
    params.set("minPrice", price[0].toString());
    params.set("maxPrice", price[1].toString());
    params.set("instant", instant.toString());

    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  const toggleType = (id: string) => {
    const newTypes = { ...checkedTypes, [id]: !checkedTypes[id] };
    setCheckedTypes(newTypes);
    updateURL(newTypes, instantBooking, priceRange);
  };

  const handleInstantBookingChange = (val: boolean) => {
    setInstantBooking(val);
    updateURL(checkedTypes, val, priceRange);
  };

  const handlePriceDragEnd = (val: number[]) => {
    updateURL(checkedTypes, instantBooking, val);
  };

  const toggleChip = (val: string, currentSelected: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    const isSelected = currentSelected.includes(val);
    let newSelected;
    // Special case for "Не важно" - if clicked, clear others. If others clicked, clear "Не важно"
    if (val === "Не важно") {
      newSelected = isSelected ? [] : ["Не важно"];
    } else {
      newSelected = isSelected 
        ? currentSelected.filter(item => item !== val)
        : [...currentSelected.filter(item => item !== "Не важно"), val];
    }
    setter(newSelected);
  };

  const toggleFeature = (id: string) => {
    const newFeatures = { ...checkedFeatures, [id]: !checkedFeatures[id] };
    setCheckedFeatures(newFeatures);
    // Optionally we can update URLs here for features if we serialize them.
    // For now, tracking them locally works for visual reset and `hasActiveFilters`.
  };

  const resetFilters = () => {
    setCheckedTypes({ apartments: true });
    // Do NOT reset instantBooking
    setPriceRange([0, 20000]);
    setSelectedBedrooms([]);
    setSelectedFloorChips([]);
    setSelectedStars([]);
    setAreaRange(["", ""]);
    setFloorRange(["", ""]);
    setCheckedFeatures({});
    updateURL({ apartments: true }, instantBooking, [0, 20000]);
  };

  return (
    <div className={cn("flex flex-col gap-[1px] w-72 pb-20 relative", !isDetailed && "gap-4")}>
      {/* Быстрое бронирование */}
      <div className="w-72 p-6 bg-white rounded-xl flex flex-col gap-5 overflow-hidden shadow-sm">
        <div className="self-stretch flex justify-start items-start">
          <div className="flex-1 flex flex-col justify-start items-start">
            <label
              htmlFor="instant-booking"
              className="self-stretch justify-start text-black text-base font-normal font-['NT_Somic'] leading-6 cursor-pointer"
            >
              Быстрое бронирование
            </label>
            <div className="self-stretch justify-start text-muted-foreground text-xs font-medium font-['NT_Somic'] leading-4 mt-0.5">
              Всего 2 минуты, без ожидания ответа от хозяина
            </div>
          </div>
          <div className="flex justify-start items-center pl-2">
            <Switch
              id="instant-booking"
              className="data-[state=checked]:bg-orange-500"
              checked={instantBooking}
              onCheckedChange={handleInstantBookingChange}
            />
          </div>
        </div>
      </div>

      {/* Популярные фильтры - Detailed Only */}
      {isDetailed && (
        <FilterGroup title="Популярные фильтры">
          <div className="flex flex-col gap-3">
            {["Бесконтактное заселение", "Парковка", "Жилье со скидкой"].map((item) => (
              <div key={item} className="flex items-end gap-3 w-full">
                <Checkbox 
                  id={item} 
                  className="w-4 h-4 rounded border-border" 
                  checked={!!checkedFeatures[item]}
                  onCheckedChange={() => toggleFeature(item)}
                />
                <label htmlFor={item} className="flex justify-center flex-1 items-center justify-start text-foreground text-sm font-medium font-['NT_Somic'] leading-5 cursor-pointer pb-0.5">
                  <span className="w-full text-left">{item}</span>
                </label>
              </div>
            ))}
          </div>
        </FilterGroup>
      )}

      {/* Тип жилья */}
      <FilterGroup title="Тип жилья">
        <div className="flex flex-col gap-3">
          {(isDetailed ? HOUSING_TYPES : HOUSING_TYPES.slice(0, 5)).map((type) => (
            <div key={type.id} className="flex items-end gap-3 w-full">
              <Checkbox
                id={type.id}
                className="w-4 h-4 rounded border-border"
                checked={!!checkedTypes[type.id]}
                onCheckedChange={() => toggleType(type.id)}
              />
              <label htmlFor={type.id} className="flex justify-center flex-1 items-center justify-start text-foreground text-sm font-medium font-['NT_Somic'] leading-5 cursor-pointer pb-0.5">
                <span className="w-full text-left">{type.label}</span>
              </label>
            </div>
          ))}
        </div>
      </FilterGroup>

      {/* Цена, ₽ */}
      <FilterGroup title="Цена за сутки">
        <div className="flex flex-col gap-5">
          <div className="self-stretch flex justify-start items-center gap-1.5">
            <div className="flex-1 h-11 px-4 py-2 bg-background rounded-2xl outline outline-1 outline-offset-[-1px] outline-border flex justify-between items-center overflow-hidden">
              <div className={cn("justify-start text-sm font-medium font-['NT_Somic'] leading-5", priceRange[0] === 0 ? "text-muted-foreground" : "text-foreground")}>
                {priceRange[0].toLocaleString()}
              </div>
              <div className="justify-start text-foreground text-sm font-medium font-['NT_Somic'] leading-5">
                ₽
              </div>
            </div>
            <div className="justify-start text-foreground text-sm font-medium font-['NT_Somic'] leading-5">
              —
            </div>
            <div className="flex-1 h-11 px-4 py-2 bg-background rounded-2xl outline outline-1 outline-offset-[-1px] outline-border flex justify-between items-center overflow-hidden">
              <div className={cn("justify-start text-sm font-medium font-['NT_Somic'] leading-5 whitespace-nowrap", priceRange[1] === 0 ? "text-muted-foreground" : "text-foreground")}>
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
            onPointerUp={() => handlePriceDragEnd(priceRange)}
            className="mt-1"
          />
        </div>
      </FilterGroup>

      {isDetailed && (
        <>
          {/* Оценка по отзывам */}
          <FilterGroup title="Оценка по отзывам">
            <div className="flex flex-col gap-3">
              {["Топ 9+", "Отлично 8+", "Хорошо 7+", "Пойдет 6+"].map((item) => (
                <div key={item} className="flex items-end gap-3 w-full">
                  <Checkbox id={item} className="w-4 h-4 rounded border-border" />
                  <label htmlFor={item} className="flex justify-center flex-1 items-center justify-start text-foreground text-sm font-medium font-['NT_Somic'] leading-5 cursor-pointer pb-0.5">
                    <span className="w-full text-left">{item}</span>
                  </label>
                </div>
              ))}
            </div>
          </FilterGroup>

          {/* Отдельные спальни */}
          <FilterGroup title="Отдельные спальни">
            <div className="flex flex-wrap gap-1">
              {["Не важно", "1+", "2+", "3+", "4+"].map((item) => {
                const isSelected = selectedBedrooms.includes(item);
                return (
                  <button 
                    key={item} 
                    onClick={() => toggleChip(item, selectedBedrooms, setSelectedBedrooms)}
                    className={cn(
                      "h-10 px-4 rounded-2xl text-sm font-medium transition-colors",
                      isSelected ? "bg-orange-500 text-white border-transparent" : "bg-transparent border border-gray-100 text-foreground hover:bg-gray-50"
                    )}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </FilterGroup>

          {/* В помещении */}
          <FilterGroup title="В помещении">
            <div className="flex flex-col gap-3">
              {(showAllAmenities ? AMENITIES : AMENITIES.slice(0, 5)).map((item) => (
                <div key={item} className="flex items-end gap-3 w-full">
                  <Checkbox 
                    id={item} 
                    className="w-4 h-4 rounded border-border" 
                    checked={!!checkedFeatures[item]}
                    onCheckedChange={() => toggleFeature(item)}
                  />
                  <label htmlFor={item} className="flex justify-center flex-1 items-center justify-start text-foreground text-sm font-medium font-['NT_Somic'] leading-5 cursor-pointer pb-0.5">
                    <span className="w-full text-left">{item}</span>
                  </label>
                </div>
              ))}
            </div>
            {AMENITIES.length > 5 && (
              <button 
                onClick={() => setShowAllAmenities(!showAllAmenities)}
                className="w-full mt-4 h-11 bg-gray-100 rounded-2xl text-neutral-950 text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                {showAllAmenities ? "Скрыть" : "Показать все"}
              </button>
            )}
          </FilterGroup>

          {/* Площадь */}
          <FilterGroup title="Площадь">
            <div className="flex items-center gap-1.5">
              <div className="flex-1 h-11 px-4 py-2 bg-background rounded-2xl outline outline-1 outline-offset-[-1px] outline-border flex justify-between items-center overflow-hidden flex items-center justify-between">
                <input 
                  type="number" 
                  value={areaRange[0]}
                  onChange={(e) => setAreaRange([e.target.value, areaRange[1]])}
                  className="w-full bg-transparent outline-none text-foreground text-sm font-medium font-['NT_Somic'] leading-5 placeholder:text-muted-foreground" 
                  placeholder="от" 
                />
                <span className="text-foreground text-sm font-medium font-['NT_Somic'] leading-5">м²</span>
              </div>
              <span className="text-foreground text-sm font-medium font-['NT_Somic'] leading-5">—</span>
              <div className="flex-1 h-11 px-4 py-2 bg-background rounded-2xl outline outline-1 outline-offset-[-1px] outline-border flex justify-between items-center overflow-hidden flex items-center justify-between">
                <input 
                  type="number" 
                  value={areaRange[1]}
                  onChange={(e) => setAreaRange([areaRange[0], e.target.value])}
                  className="w-full bg-transparent outline-none text-foreground text-sm font-medium font-['NT_Somic'] leading-5 placeholder:text-muted-foreground" 
                  placeholder="до" 
                />
                <span className="text-foreground text-sm font-medium font-['NT_Somic'] leading-5">м²</span>
              </div>
            </div>
          </FilterGroup>

          {/* Этаж */}
          <FilterGroup title="Этаж">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-11 px-4 py-2 bg-background rounded-2xl outline outline-1 outline-offset-[-1px] outline-border flex items-center justify-between">
                  <input 
                    type="number" 
                    value={floorRange[0]}
                    onChange={(e) => setFloorRange([e.target.value, floorRange[1]])}
                    className="w-full bg-transparent outline-none text-foreground text-sm font-medium font-['NT_Somic'] leading-5 placeholder:text-muted-foreground" 
                    placeholder="от" 
                  />
                  <span className="text-foreground text-sm font-medium font-['NT_Somic'] leading-5">эт.</span>
                </div>
                <span className="text-foreground text-sm font-medium font-['NT_Somic'] leading-5">—</span>
                <div className="flex-1 h-11 px-4 py-2 bg-background rounded-2xl outline outline-1 outline-offset-[-1px] outline-border flex items-center justify-between">
                  <input 
                    type="number" 
                    value={floorRange[1]}
                    onChange={(e) => setFloorRange([floorRange[0], e.target.value])}
                    className="w-full bg-transparent outline-none text-foreground text-sm font-medium font-['NT_Somic'] leading-5 placeholder:text-muted-foreground" 
                    placeholder="до" 
                  />
                  <span className="text-foreground text-sm font-medium font-['NT_Somic'] leading-5">эт.</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {["Не первый", "Не цоколь", "Последний", "Не последний"].map((item) => {
                  const isSelected = selectedFloorChips.includes(item);
                  return (
                    <button 
                      key={item} 
                      onClick={() => toggleChip(item, selectedFloorChips, setSelectedFloorChips)}
                      className={cn(
                        "h-10 px-4 rounded-2xl text-sm font-medium transition-colors border",
                        isSelected ? "bg-orange-500 text-white border-transparent" : "bg-transparent border-gray-100 text-foreground hover:bg-gray-50"
                      )}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </FilterGroup>

          {/* Правила размещения */}
          <FilterGroup title="Правила размещения">
            <div className="flex flex-col gap-3">
              {RULES.map((item) => (
                <div key={item} className="flex items-end gap-3 w-full">
                  <Checkbox 
                    id={item} 
                    className="w-4 h-4 rounded border-border" 
                    checked={!!checkedFeatures[item]}
                    onCheckedChange={() => toggleFeature(item)}
                  />
                  <label htmlFor={item} className="flex justify-center flex-1 items-center justify-start text-foreground text-sm font-medium font-['NT_Somic'] leading-5 cursor-pointer pb-0.5">
                    <span className="w-full text-left">{item}</span>
                  </label>
                </div>
              ))}
            </div>
          </FilterGroup>

          {/* На территории */}
          <FilterGroup title="На территории">
            <div className="flex flex-col gap-3">
              {ON_SITE.map((item) => (
                <div key={item} className="flex items-end gap-3 w-full">
                  <Checkbox 
                    id={item} 
                    className="w-4 h-4 rounded border-border" 
                    checked={!!checkedFeatures[item]}
                    onCheckedChange={() => toggleFeature(item)}
                  />
                  <label htmlFor={item} className="flex justify-center flex-1 items-center justify-start text-foreground text-sm font-medium font-['NT_Somic'] leading-5 cursor-pointer pb-0.5">
                    <span className="w-full text-left">{item}</span>
                  </label>
                </div>
              ))}
            </div>
          </FilterGroup>

          {/* Вид из окон */}
          <FilterGroup title="Вид из окон">
            <div className="flex flex-col gap-3">
              {VIEWS.map((item) => (
                <div key={item} className="flex items-end gap-3 w-full">
                  <Checkbox 
                    id={item} 
                    className="w-4 h-4 rounded border-border" 
                    checked={!!checkedFeatures[item]}
                    onCheckedChange={() => toggleFeature(item)}
                  />
                  <label htmlFor={item} className="flex justify-center flex-1 items-center justify-start text-foreground text-sm font-medium font-['NT_Somic'] leading-5 cursor-pointer pb-0.5">
                    <span className="w-full text-left">{item}</span>
                  </label>
                </div>
              ))}
            </div>
          </FilterGroup>

          {/* Санузел */}
          <FilterGroup title="Санузел">
            <div className="flex flex-col gap-3">
              {BATHROOMS.map((item) => (
                <div key={item} className="flex items-end gap-3 w-full">
                  <Checkbox 
                    id={item} 
                    className="w-4 h-4 rounded border-border" 
                    checked={!!checkedFeatures[item]}
                    onCheckedChange={() => toggleFeature(item)}
                  />
                  <label htmlFor={item} className="flex justify-center flex-1 items-center justify-start text-foreground text-sm font-medium font-['NT_Somic'] leading-5 cursor-pointer pb-0.5">
                    <span className="w-full text-left">{item}</span>
                  </label>
                </div>
              ))}
            </div>
          </FilterGroup>

          {/* Питание */}
          <FilterGroup title="Питание">
            <div className="flex flex-col gap-3">
              {DINING.map((item) => (
                <div key={item} className="flex items-end gap-3 w-full">
                  <Checkbox 
                    id={item} 
                    className="w-4 h-4 rounded border-border" 
                    checked={!!checkedFeatures[item]}
                    onCheckedChange={() => toggleFeature(item)}
                  />
                  <label htmlFor={item} className="flex justify-center flex-1 items-center justify-start text-foreground text-sm font-medium font-['NT_Somic'] leading-5 cursor-pointer pb-0.5">
                    <span className="w-full text-left">{item}</span>
                  </label>
                </div>
              ))}
            </div>
          </FilterGroup>

          {/* Звёздность отеля */}
          <FilterGroup title="Звёздность отеля">
            <div className="flex flex-wrap gap-1">
              {["5", "4", "3", "2", "1 или без рейтинга"].map((item) => {
                const isSelected = selectedStars.includes(item);
                return (
                  <button 
                    key={item} 
                    onClick={() => toggleChip(item, selectedStars, setSelectedStars)}
                    className={cn(
                      "h-10 px-4 rounded-2xl border text-sm font-medium inline-flex items-center gap-1 transition-colors",
                      isSelected ? "bg-orange-500 text-white border-transparent" : "bg-transparent border-gray-100 text-foreground hover:bg-gray-50"
                    )}
                  >
                    {item} <span className="text-xs">★</span>
                  </button>
                );
              })}
            </div>
          </FilterGroup>

          {/* Дополнительно */}
          <FilterGroup title="Дополнительно">
            <div className="flex flex-col gap-3">
              {EXTRA.map((item) => (
                <div key={item} className="flex items-end gap-3 w-full">
                  <Checkbox 
                    id={item} 
                    className="w-4 h-4 rounded border-border" 
                    checked={!!checkedFeatures[item]}
                    onCheckedChange={() => toggleFeature(item)}
                  />
                  <label htmlFor={item} className="flex justify-center flex-1 items-center justify-start text-foreground text-sm font-medium font-['NT_Somic'] leading-5 cursor-pointer pb-0.5">
                    <span className="w-full text-left">{item}</span>
                  </label>
                </div>
              ))}
            </div>
          </FilterGroup>
        </>
      )}

      {/* Сбросить все фильтры - Detailed Only */}
      {isDetailed && hasActiveFilters && (
        <div className="fixed bottom-[40px] z-50 w-72 pointer-events-none flex justify-center">
          <div className="w-full px-4 text-center">
            <Button onClick={resetFilters} className="w-full h-11 pointer-events-auto bg-neutral-950 hover:bg-neutral-800 text-white rounded-2xl text-sm font-medium shadow-2xl">
              Сбросить все фильтры
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
