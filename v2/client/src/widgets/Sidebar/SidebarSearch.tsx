import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  setPriceRange, 
  setInstantBooking, 
  setHousingTypes,
  toggleAmenity, 
  setMinRating, 
  setRoomFilters,
  setAreaRange,
  setFloorRange,
  setRules
} from "../../features/search-properties/model/search-slice.ts";
import { Switch } from "../../shared/ui/Switch/Switch.tsx";
import { Checkbox } from "../../shared/ui/Checkbox/Checkbox.tsx";
import { Slider } from "../../shared/ui/Slider/Slider.tsx";
import { cn } from "../../shared/lib/clsx.ts";
import type { RootState } from "../../app/store.ts";
import s from "./SidebarSearch.module.css";

const HOUSING_TYPES = [
  { id: "apartments", label: "Квартиры, апартаменты" },
  { id: "houses", label: "Дома, коттеджи" },
  { id: "rooms", label: "Комнаты" },
  { id: "hotels", label: "Отели, гостиницы" },
  { id: "apart-hotels", label: "Апарт-отели" },
  { id: "mini-hotels", label: "Мини-гостиницы" },
  { id: "guest-houses", label: "Гостевые дома" },
  { id: "glampings", label: "Глэмпинги, базы отдыха" },
  { id: "hostels", label: "Хостелы" },
  { id: "studios", label: "Студии" },
];

const AMENITY_CATEGORIES = [
  { 
    title: "В помещении", 
    items: ["Интернет Wi-Fi", "Кондиционер", "Кухня", "Холодильник", "Балкон, лоджия", "Детская кроватка", "Стиральная машина", "Телевизор", "Электрочайник", "Посуда и принадлежности"]
  },
  { 
    title: "На территории", 
    items: ["Парковка", "Беседка", "Мангал", "Бассейн", "Детская площадка"]
  },
  { 
    title: "Вид из окон", 
    items: ["На море", "На горы", "На реку, озеро", "На город"]
  },
  { 
    title: "Санузел", 
    items: ["Своя ванная комната", "Свой туалет", "Свой душ"]
  },
  { 
    title: "Питание", 
    items: ["Завтрак", "Обед", "Ужин"]
  },
  { 
    title: "Доступность", 
    items: ["Лифт", "Доступ для инвалидов"]
  },
  { 
    title: "Дополнительно", 
    items: ["Быстро отвечают", "Трансфер", "Ранний заезд разрешен", "Поздний отъезд разрешен", "Предоплата 100%"]
  }
];

export function SidebarSearch() {
  const dispatch = useDispatch();
  const { 
    minPrice,
    maxPrice, 
    instantBooking, 
    housingTypes,
    rooms,
    bedrooms,
    beds,
    doubleBeds,
    minRating,
    amenities,
    areaMin,
    areaMax,
    floorMin,
    floorMax,
    smoking,
    parties,
    noDeposit
  } = useSelector((state: RootState) => state.search);

  const [expandedCategories, setExpandedCategories] = React.useState<string[]>([]);

  const toggleCategory = (title: string) => {
    setExpandedCategories(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const toggleType = (id: string) => {
    const nextTypes = housingTypes.includes(id)
      ? housingTypes.filter(t => t !== id)
      : [...housingTypes, id];
    dispatch(setHousingTypes(nextTypes));
  };

  return (
    <div className={s.wrapper}>
      {/* 1. Instant Booking Card */}
      <div className={s.card}>
        <div className={s.rowBetween}>
          <div className={s.col}>
            <div className={s.cardTitle}>Быстрое бронирование</div>
            <div className={s.cardDesc}>Всего 2 минуты, без ожидания ответа от хозяина</div>
          </div>
          <Switch 
            checked={instantBooking}
            onCheckedChange={(val) => dispatch(setInstantBooking(val))}
            className="data-[state=checked]:bg-orange-500"
          />
        </div>
      </div>

      {/* 2. Popular Filters */}
      <div className={s.card}>
        <div className={s.cardTitle}>Популярные фильтры</div>
        <div className={s.checkboxList}>
          {[
            { id: 'contactless', label: 'Бесконтактное заселение' },
            { id: 'parking-pop', label: 'Парковка' },
            { id: 'discount', label: 'Жилье со скидкой' },
          ].map(f => (
            <div key={f.id} className={s.checkboxItem}>
              <Checkbox 
                id={f.id} 
                checked={amenities.includes(f.label)} 
                onCheckedChange={() => dispatch(toggleAmenity(f.label))} 
              />
              <label htmlFor={f.id} className={s.checkboxLabel}>{f.label}</label>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Price Card */}
      <div className={s.card}>
        <div className={s.cardTitle}>Цена, ₽</div>
        <div className={s.priceTabs}>
          <button className={cn(s.priceTab, s.active)}>за сутки</button>
          <button className={s.priceTab}>за 15 суток</button>
        </div>
        <div className={s.priceInputs}>
          <div className={s.priceInputBox}>
            <span className={s.priceHint}>от </span>
            <span className={s.priceValue}>{minPrice.toLocaleString()}</span>
            <span className={s.priceCurrency}>₽</span>
          </div>
          <span className={s.dash}>—</span>
          <div className={s.priceInputBox}>
            <span className={s.priceHint}>до </span>
            <span className={s.priceValue}>{maxPrice >= 50000 ? "50 000 +" : maxPrice.toLocaleString()}</span>
            <span className={s.priceCurrency}>₽</span>
          </div>
        </div>
        <Slider
          value={[minPrice, maxPrice]}
          max={50000}
          min={0}
          step={500}
          onValueChange={(val) => dispatch(setPriceRange(val as [number, number]))}
          className="mt-4"
        />
      </div>

      {/* 4. Rating Card */}
      <div className={s.card}>
        <div className={s.cardTitle}>Оценка по отзывам</div>
        <div className={s.checkboxList}>
          {[
            { val: 4.5, label: 'Топ 9+' },
            { val: 4.0, label: 'Отлично 8+' },
            { val: 3.5, label: 'Хорошо 7+' },
            { val: 3.0, label: 'Пойдет 6+' },
          ].map(r => (
            <div key={r.val} className={s.checkboxItem}>
              <Checkbox 
                id={`rating-${r.val}`} 
                checked={minRating === r.val} 
                onCheckedChange={() => dispatch(setMinRating(minRating === r.val ? 0 : r.val))} 
              />
              <label htmlFor={`rating-${r.val}`} className={s.checkboxLabel}>{r.label}</label>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Housing Type */}
      <div className={s.card}>
        <div className={s.cardTitle}>Тип жилья</div>
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
      </div>

      {/* 6. Bedrooms Card */}
      <div className={s.card}>
        <div className={s.cardTitle}>Отдельные спальни</div>
        <div className={s.pillList}>
          {[0, 1, 2, 3, 4].map(val => (
            <button
              key={val}
              className={cn(s.pill, bedrooms === val && s.active)}
              onClick={() => dispatch(setRoomFilters({ bedrooms: val }))}
            >
              {val === 0 ? "Не важно" : `${val}+`}
            </button>
          ))}
        </div>
      </div>

      {/* 7. Beds Card */}
      <div className={s.card}>
        <div className={s.cardTitle}>Всего кроватей, диванов</div>
        <div className={s.pillList}>
          {[0, 2, 3, 4, 5].map(val => (
            <button
              key={val}
              className={cn(s.pill, beds === val && s.active)}
              onClick={() => dispatch(setRoomFilters({ beds: val }))}
            >
              {val === 0 ? "Не важно" : `${val}+`}
            </button>
          ))}
        </div>
      </div>

      {/* 8. Double Beds Card */}
      <div className={s.card}>
        <div className={s.cardTitle}>Двуспальные кровати</div>
        <div className={s.pillList}>
          {[0, 1, 2, 3].map(val => (
            <button
              key={val}
              className={cn(s.pill, doubleBeds === val && s.active)}
              onClick={() => dispatch(setRoomFilters({ doubleBeds: val }))}
            >
              {val === 0 ? "Не важно" : `${val}+`}
            </button>
          ))}
        </div>
      </div>

      {/* 9. Area Card */}
      <div className={s.card}>
        <div className={s.cardTitle}>Площадь</div>
        <div className={s.priceInputs}>
          <div className={s.priceInputBox}>
            <span className={s.priceHint}>от </span>
            <span className={s.priceValue}>{areaMin}</span>
            <span className={s.priceCurrency}>м²</span>
          </div>
          <span className={s.dash}>—</span>
          <div className={s.priceInputBox}>
            <span className={s.priceHint}>до </span>
            <span className={s.priceValue}>{areaMax}</span>
            <span className={s.priceCurrency}>м²</span>
          </div>
        </div>
      </div>

      {/* 10. Rules Card */}
      <div className={s.card}>
        <div className={s.cardTitle}>Правила размещения</div>
        <div className={s.checkboxList}>
          {[
            { id: 'smoking', label: 'Курение разрешено', value: smoking },
            { id: 'parties', label: 'Вечеринки разрешены', value: parties },
            { id: 'noDeposit', label: 'Заселение без депозита', value: noDeposit },
          ].map(r => (
            <div key={r.id} className={s.checkboxItem}>
              <Checkbox 
                id={r.id} 
                checked={r.value} 
                onCheckedChange={(val) => dispatch(setRules({ [r.id]: !!val }))} 
              />
              <label htmlFor={r.id} className={s.checkboxLabel}>{r.label}</label>
            </div>
          ))}
        </div>
      </div>

      {/* 11. Categorized Amenities */}
      {AMENITY_CATEGORIES.map(cat => (
        <div key={cat.title} className={s.card}>
          <div className={s.cardTitle}>{cat.title}</div>
          <div className={cn(s.checkboxList, !expandedCategories.includes(cat.title) && s.collapsed)}>
            {cat.items.map(item => (
              <div key={item} className={s.checkboxItem}>
                <Checkbox 
                  id={`${cat.title}-${item}`} 
                  checked={amenities.includes(item)} 
                  onCheckedChange={() => dispatch(toggleAmenity(item))} 
                />
                <label htmlFor={`${cat.title}-${item}`} className={s.checkboxLabel}>{item}</label>
              </div>
            ))}
          </div>
          {cat.items.length > 5 && (
            <button className={s.showAllBtn} onClick={() => toggleCategory(cat.title)}>
              {expandedCategories.includes(cat.title) ? "Скрыть" : "Показать все"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
