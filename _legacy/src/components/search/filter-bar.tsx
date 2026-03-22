"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ChevronDown, 
  SlidersHorizontal, 
  Zap, 
  Plus, 
  Minus, 
  Star,
  CheckCircle,
  X 
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components (Inline for professional encapsulation) ---

const FilterSection = ({ title, showReset, onReset, children }: any) => (
  <div className="flex flex-col gap-5 py-8 first:pt-2 border-b border-gray-100/60 last:border-0 grow-0 shrink-0">
    <div className="flex items-center justify-between">
      <h3 className="text-base font-bold text-foreground tracking-tight uppercase tracking-[0.05em]">{title}</h3>
      {showReset && (
        <button onClick={onReset} className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest">
          Сбросить
        </button>
      )}
    </div>
    <div className="flex flex-col gap-4">{children}</div>
  </div>
);

const CounterField = ({ label, value, onChange, min = 0 }: any) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-sm font-semibold text-foreground/80">{label}</span>
    <div className="flex items-center gap-4">
      <button 
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-foreground hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="text-sm font-bold w-6 text-center tabular-nums">{value === 0 ? "0+" : `${value}+`}</span>
      <button 
        onClick={() => onChange(value + 1)}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-foreground hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// --- Main Component ---

const HOUSING_TYPES = [
  { id: "apartments", label: "Квартиры, апартаменты" },
  { id: "houses", label: "Дома, коттеджи" },
  { id: "rooms", label: "Комнаты" },
  { id: "hotels", label: "Отели, гостиницы" },
  { id: "guest-houses", label: "Гостевые дома" },
];

const RATINGS = [
  { id: "9", label: "Топ 9+" },
  { id: "8", label: "Отлично 8+" },
  { id: "7", label: "Хорошо 7+" },
  { id: "6", label: "Пойдёт 6+" },
];

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  // Filter State
  const [state, setState] = React.useState<any>(() => {
    const params = Object.fromEntries(searchParams.entries());
    return {
      instant: params.instant === "true",
      price: params.price ? JSON.parse(params.price) : [0, 25000],
      rating: params.rating || null,
      housingTypes: params.housingTypes ? JSON.parse(params.housingTypes) : { apartments: true },
      bedrooms: parseInt(params.bedrooms || "0"),
      beds: parseInt(params.beds || "0"),
      area: params.area ? JSON.parse(params.area) : { min: "", max: "" },
      rules: params.rules ? JSON.parse(params.rules) : {},
      facilities: params.facilities ? JSON.parse(params.facilities) : {},
      stars: params.stars ? parseInt(params.stars) : null,
    };
  });

  const updateState = (key: string, val: any) => setState((p: any) => ({ ...p, [key]: val }));

  // URL Sync with Debounce
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const current = new URLSearchParams(searchParams.toString());
      Object.entries(state).forEach(([key, val]) => {
        if (val === null || (typeof val === "object" && Object.keys(val).length === 0)) {
          current.delete(key);
        } else {
          current.set(key, typeof val === "string" ? val : JSON.stringify(val));
        }
      });
      router.replace(`${pathname}?${current.toString()}`, { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
  }, [state, router, pathname, searchParams]);

  return (
    <div className="relative z-50">
      {/* Search Header / Trigger Row */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-2.5 px-6 py-3 rounded-full border border-gray-200 transition-all",
            isOpen ? "bg-foreground text-background border-foreground shadow-[0_10px_20px_rgba(0,0,0,0.1)]" : "bg-white hover:border-foreground/30 shadow-sm"
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-bold tracking-tight">Фильтры</span>
        </button>

        <div className="w-px h-8 bg-gray-200 mx-2 opacity-50" />

        <button
          onClick={() => updateState("instant", !state.instant)}
          className={cn(
            "flex items-center gap-2.5 px-6 py-3 rounded-full border transition-all whitespace-nowrap shadow-sm",
            state.instant 
              ? "bg-amber-50 border-amber-200 text-amber-600 shadow-amber-200/20" 
              : "bg-white hover:border-foreground/30 border-gray-200"
          )}
        >
          <Zap className={cn("w-4 h-4", state.instant && "fill-amber-500 text-amber-500")} />
          <span className="text-sm font-bold tracking-tight">Быстрое бронирование</span>
        </button>

        {/* Quick Price Display */}
        <div className="hidden lg:flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 shadow-sm">
          <span className="text-sm font-bold text-foreground/50 tabular-nums">{state.price[0]} — {state.price[1]}+ ₽</span>
        </div>
      </div>

      {/* Exhaustive Filter Panel (Overlay/Drawer Style) */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-white shadow-2xl z-[60] animate-in slide-in-from-right duration-500 ease-out flex flex-col">
            <div className="flex items-center justify-between p-7 border-b border-gray-100">
              <h2 className="text-xl font-bold tracking-tight">Все фильтры</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ScrollArea className="flex-1 px-7 custom-scrollbar">
              <div className="flex flex-col pb-10">
                
                {/* Instant Booking Switch */}
                <div className="py-8 flex items-center justify-between border-b border-gray-100/60">
                  <div className="flex flex-col gap-0.5">
                    <Label className="text-base font-bold text-foreground">Быстрое бронирование</Label>
                    <span className="text-xs font-semibold text-muted-foreground/80 lowercase">Без ожидания ответа от хозяина</span>
                  </div>
                  <Switch checked={state.instant} onCheckedChange={(v) => updateState("instant", v)} />
                </div>

                <FilterSection title="Популярные фильтры" showReset={false}>
                  {["Бесконтактное заселение", "Парковка", "Жилье со скидкой"].map((label, idx) => (
                    <div key={idx} className="flex items-center space-x-3 group cursor-pointer">
                      <Checkbox id={`panel-pop-${idx}`} />
                      <Label htmlFor={`panel-pop-${idx}`} className="text-[14px] font-bold cursor-pointer group-hover:text-primary transition-colors">{label}</Label>
                    </div>
                  ))}
                </FilterSection>

                <FilterSection title="Цена за сутки, ₽">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 bg-white border border-gray-200 rounded-2xl px-5 py-3 text-sm font-bold shadow-sm">{state.price[0].toLocaleString()} ₽</div>
                    <span className="text-muted-foreground font-bold">—</span>
                    <div className="flex-1 bg-white border border-gray-200 rounded-2xl px-5 py-3 text-sm font-bold shadow-sm">{state.price[1].toLocaleString()}+ ₽</div>
                  </div>
                  <Slider 
                    value={state.price} 
                    min={0} 
                    max={50000} 
                    step={500} 
                    onValueChange={(v) => updateState("price", v)} 
                    className="mt-2"
                  />
                </FilterSection>

                <FilterSection title="Оценка по отзывам" showReset={state.rating !== null} onReset={() => updateState("rating", null)}>
                  <div className="flex flex-wrap gap-2.5">
                    {RATINGS.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => updateState("rating", state.rating === r.id ? null : r.id)}
                        className={cn(
                          "px-4 py-2.5 rounded-2xl text-sm font-bold border transition-all shadow-sm",
                          state.rating === r.id ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="Тип жилья">
                  <div className="flex flex-col gap-4">
                    {HOUSING_TYPES.map((type) => (
                      <div key={type.id} className="flex items-center space-x-3 group cursor-pointer">
                        <Checkbox 
                          id={`type-${type.id}`} 
                          checked={!!state.housingTypes[type.id]} 
                          onCheckedChange={(checked) => {
                            const newTypes = { ...state.housingTypes, [type.id]: checked };
                            updateState("housingTypes", newTypes);
                          }}
                        />
                        <Label htmlFor={`type-${type.id}`} className="text-[14px] font-bold cursor-pointer group-hover:text-primary transition-colors">{type.label}</Label>
                      </div>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="Вместимость">
                  <CounterField label="Отдельные спальни" value={state.bedrooms} onChange={(v: number) => updateState("bedrooms", v)} />
                  <CounterField label="Всего кроватей" value={state.beds} onChange={(v: number) => updateState("beds", v)} />
                </FilterSection>

                <FilterSection title="Удобства">
                  {["Интернет Wi-Fi", "Кондиционер", "Кухня", "Телевизор", "Стиральная машина"].map((label, idx) => (
                    <div key={idx} className="flex items-center space-x-3 group cursor-pointer">
                      <Checkbox id={`amen-${idx}`} />
                      <Label htmlFor={`amen-${idx}`} className="text-[14px] font-medium cursor-pointer group-hover:text-primary transition-colors">{label}</Label>
                    </div>
                  ))}
                  <button className="text-xs font-bold text-primary hover:underline w-fit mt-1">Показать все (26)</button>
                </FilterSection>

                <FilterSection title="Звёздность отеля">
                  <div className="flex flex-wrap gap-2.5">
                    {[5, 4, 3, 2, 1].map((n) => (
                      <button
                        key={n}
                        onClick={() => updateState("stars", state.stars === n ? null : n)}
                        className={cn(
                          "flex items-center gap-1.5 px-4.5 py-2.5 rounded-2xl text-sm font-bold border transition-all shadow-sm",
                          state.stars === n ? "bg-foreground text-background border-foreground shadow-lg" : "bg-white border-gray-200 hover:bg-gray-50 group"
                        )}
                      >
                        {n} <Star className={cn("w-3.5 h-3.5", state.stars === n ? "fill-white" : "fill-muted-foreground/30 text-muted-foreground/30 group-hover:text-primary/50")} />
                      </button>
                    ))}
                  </div>
                </FilterSection>

              </div>
            </ScrollArea>

            <div className="p-7 border-t border-gray-100 bg-white">
              <Button 
                onClick={() => setIsOpen(false)}
                className="w-full h-14 rounded-2xl bg-foreground text-background font-bold text-base hover:bg-foreground/90 active:scale-[0.98] transition-all shadow-2xl"
              >
                Показать результаты
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
