import * as React from "react";
import { SlidersHorizontal, Zap, Star, X } from "lucide-react";
import { Switch } from "../../shared/ui/Switch/Switch.tsx";
import { Checkbox } from "../../shared/ui/Checkbox/Checkbox.tsx";
import { Slider } from "../../shared/ui/Slider/Slider.tsx";
import { Label } from "../../shared/ui/Label/Label.tsx";
import { ScrollArea } from "../../shared/ui/ScrollArea/ScrollArea.tsx";
import { cn } from "../../shared/lib/clsx.ts";
import s from "./FilterBar.module.css";

const HOUSING_TYPES = [
  { id: "apartments", label: "Квартиры, апартаменты" },
  { id: "houses", label: "Дома, коттеджи" },
  { id: "rooms", label: "Комнаты" },
  { id: "hotels", label: "Отели, гостиницы" },
  { id: "guest-houses", label: "Гостевые дома" },
];

export function FilterBar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [state, setState] = React.useState<any>({
    instant: false,
    price: [0, 25000],
    rating: null,
    housingTypes: { apartments: true },
    stars: null,
  });

  const updateState = (key: string, val: any) => setState((p: any) => ({ ...p, [key]: val }));

  return (
    <div className={s.filterBar}>
      <div className={s.triggerRow}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={cn(s.filterTrigger, isOpen && s.filterTriggerOpen)}
        >
          <SlidersHorizontal size={16} />
          <span style={{ fontWeight: 700 }}>Фильтры</span>
        </button>

        <div className={s.divider} />

        <button
          onClick={() => updateState("instant", !state.instant)}
          className={cn(s.instantTrigger, state.instant && s.instantActive)}
        >
          <Zap size={16} fill={state.instant ? "currentColor" : "none"} />
          <span style={{ fontWeight: 700 }}>Быстрое бронирование</span>
        </button>

        <div className={s.priceDisplay}>
          <span>{state.price[0]} — {state.price[1]}+ ₽</span>
        </div>
      </div>

      {isOpen && (
        <>
          <div className={s.overlay} onClick={() => setIsOpen(false)} />
          <div className={s.panel}>
            <div className={s.panelHeader}>
              <h2 className={s.panelTitle}>Все фильтры</h2>
              <button onClick={() => setIsOpen(false)} className={s.closeButton}>
                <X size={20} />
              </button>
            </div>

            <ScrollArea className={s.scrollArea}>
              <div className={s.panelContent}>
                
                <div className={s.switchSection}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                    <Label style={{ fontSize: '1rem', fontWeight: 700 }}>Быстрое бронирование</Label>
                    <span style={{ fontSize: '0.75rem', color: '#737373' }}>Без ожидания ответа от хозяина</span>
                  </div>
                  <Switch checked={state.instant} onCheckedChange={(v) => updateState("instant", v)} />
                </div>

                <div className={s.section}>
                  <div className={s.sectionTitle}>
                    <h3>Цена за сутки, ₽</h3>
                  </div>
                  <div className={s.priceInputs}>
                    <div className={s.priceInput}>{state.price[0].toLocaleString()} ₽</div>
                    <span style={{ fontWeight: 700, color: '#737373' }}>—</span>
                    <div className={s.priceInput}>{state.price[1].toLocaleString()}+ ₽</div>
                  </div>
                  <Slider 
                    value={state.price} 
                    min={0} 
                    max={50000} 
                    step={500} 
                    onValueChange={(v) => updateState("price", v)} 
                  />
                </div>

                <div className={s.section}>
                  <div className={s.sectionTitle}>
                    <h3>Тип жилья</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {HOUSING_TYPES.map((type) => (
                      <div key={type.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Checkbox 
                          id={`type-${type.id}`} 
                          checked={!!state.housingTypes[type.id]} 
                          onCheckedChange={(checked) => {
                            updateState("housingTypes", { ...state.housingTypes, [type.id]: checked });
                          }}
                        />
                        <Label htmlFor={`type-${type.id}`} style={{ cursor: 'pointer' }}>{type.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={s.section}>
                  <div className={s.sectionTitle}>
                    <h3>Звёздность отеля</h3>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                    {[5, 4, 3, 2, 1].map((n) => (
                      <button
                        key={n}
                        onClick={() => updateState("stars", state.stars === n ? null : n)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          padding: '0.625rem 1.125rem',
                          borderRadius: '1rem',
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          border: '1px solid #e5e5e5',
                          backgroundColor: state.stars === n ? 'var(--foreground)' : 'white',
                          color: state.stars === n ? 'var(--background)' : 'var(--foreground)',
                          transition: 'all 0.2s'
                        }}
                      >
                        {n} <Star size={14} fill={state.stars === n ? "white" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </ScrollArea>

            <div className={s.panelFooter}>
              <button onClick={() => setIsOpen(false)} className={s.applyButton}>
                Показать результаты
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
