import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../app/store.ts";
import { 
  setPriceRange, 
  setInstantBooking, 
  setHousingTypes 
} from "../../features/search-properties/model/search-slice.ts";
import { Switch } from "../../shared/ui/Switch/Switch.tsx";
import { Checkbox } from "../../shared/ui/Checkbox/Checkbox.tsx";
import { Slider } from "../../shared/ui/Slider/Slider.tsx";
import s from "./Sidebar.module.css";

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

export function Sidebar() {
  const dispatch = useDispatch();
  const { 
    minPrice, 
    maxPrice, 
    instantBooking, 
    housingTypes 
  } = useSelector((state: RootState) => state.search);

  const toggleType = (id: string) => {
    const nextTypes = housingTypes.includes(id)
      ? housingTypes.filter(t => t !== id)
      : [...housingTypes, id];
    dispatch(setHousingTypes(nextTypes));
  };

  return (
    <div className={s.sidebar}>
      <div className={s.sectionTitle}>
        Выбирайте лучшее
      </div>

      <div className={s.switchRow}>
        <div className={s.switchInfo}>
          <label htmlFor="instant-booking" className={s.switchLabel}>
            Быстрое бронирование
          </label>
          <div className={s.switchDescription}>
            Всего 2 минуты, без ожидания ответа от хозяина
          </div>
        </div>
        <div className={s.switchWrapper}>
          <Switch
            id="instant-booking"
            checked={instantBooking}
            onCheckedChange={(val) => dispatch(setInstantBooking(val))}
            className="data-[state=checked]:bg-orange-500"
          />
        </div>
      </div>

      <div className={s.checkboxList}>
        {HOUSING_TYPES.map((type) => (
          <div key={type.id} className={s.checkboxItem}>
            <Checkbox
              id={type.id}
              checked={housingTypes.includes(type.id)}
              onCheckedChange={() => toggleType(type.id)}
            />
            <label htmlFor={type.id} className={s.checkboxLabel}>
              {type.label}
            </label>
          </div>
        ))}
      </div>

      <div className={s.priceSection}>
        <div className={s.sectionTitle}>
          Цена за сутки
        </div>
        <div className={s.priceInputs}>
          <div className={s.priceInputBox}>
            <div className={s.priceValue}>
              {minPrice.toLocaleString()}
            </div>
            <div className={s.currency}>₽</div>
          </div>
          <div style={{ color: '#0a0a0a', fontWeight: 500 }}>—</div>
          <div className={s.priceInputBox}>
            <div className={s.priceValue}>
              {maxPrice.toLocaleString() + (maxPrice >= 50000 ? " +" : "")}
            </div>
            <div className={s.currency}>₽</div>
          </div>
        </div>
        
        <Slider
          value={[minPrice, maxPrice]}
          max={50000}
          min={0}
          step={500}
          onValueChange={(val) => dispatch(setPriceRange(val as [number, number]))}
          className="mt-2"
        />
      </div>

      <button className={s.applyButton}>
        <span>Показать варианты</span>
      </button>
    </div>
  );
}
