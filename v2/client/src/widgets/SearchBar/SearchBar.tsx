import * as React from "react";
import { Search, MapPin } from "lucide-react";
import { SearchInput } from "../../shared/ui/SearchInput/SearchInput.tsx";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "../../shared/lib/clsx.ts";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store.ts";
import { setCity, setGuests, setDates, fetchCities } from "../../features/search-properties/model/search-slice.ts";
import { Minus, Plus } from "lucide-react";
import s from "./SearchBar.module.css";

export function SearchBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { city, checkIn, checkOut, guests, availableCities } = useSelector((state: RootState) => state.search);
  
  const [isSuggestionsOpen, setIsSuggestionsOpen] = React.useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = React.useState(false);
  
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const checkInRef = React.useRef<HTMLInputElement>(null);
  const checkOutRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  // Закрытие при клике снаружи
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsSuggestionsOpen(false);
        setIsGuestsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleCityChange = (val: string) => {
    dispatch(setCity(val));
    setIsSuggestionsOpen(true);
  };

  const handleSelectCity = (name: string) => {
    dispatch(setCity(name));
    setIsSuggestionsOpen(false);
  };

  const filteredCities = (Array.isArray(availableCities) ? availableCities : []).filter(c => 
    c.toLowerCase().includes(city.toLowerCase())
  );

  const handleSearch = () => {
    navigate("/search");
  };

  return (
    <div className={s.searchBar} ref={wrapperRef}>
      <div className={s.container}>
        {/* City Input */}
        <div className={cn(s.inputWrapper, s.inputWrapperFull, s.relative)}>
          <SearchInput
            label="Город или адрес"
            value={city}
            variant="text"
            placeholder="Куда едем?"
            onClear={() => handleCityChange("")}
            onChange={handleCityChange}
            onClick={() => setIsSuggestionsOpen(true)}
          />

          {isSuggestionsOpen && filteredCities.length > 0 && (
            <div className={s.suggestions}>
              {filteredCities.map((c) => (
                <button 
                  key={c} 
                  className={s.suggestionItem}
                  onClick={() => handleSelectCity(c)}
                >
                  <MapPin size={16} className={s.suggestionIcon} />
                  <span>{c}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Check-In Date */}
        <div className={cn(s.inputWrapper, s.inputWrapperFixed, s.relative)}>
          <SearchInput
            label="Заезд"
            value={checkIn ? format(new Date(checkIn), "d MMM, eee", { locale: ru }) : ""}
            variant="date"
            placeholder={format(new Date(), "d MMM, eee", { locale: ru })}
            onClick={() => checkInRef.current?.showPicker()}
          />
          <input
            ref={checkInRef}
            type="date"
            className={s.dateInputHidden}
            onChange={(e) => dispatch(setDates({ checkIn: e.target.value, checkOut }))}
          />
        </div>

        {/* Check-Out Date */}
        <div className={cn(s.inputWrapper, s.inputWrapperFixed, s.relative)}>
          <SearchInput
            label="Отъезд"
            value={checkOut ? format(new Date(checkOut), "d MMM, eee", { locale: ru }) : ""}
            variant="date"
            placeholder="Выезд"
            onClick={() => checkOutRef.current?.showPicker()}
          />
          <input
            ref={checkOutRef}
            type="date"
            className={s.dateInputHidden}
            onChange={(e) => dispatch(setDates({ checkIn, checkOut: e.target.value }))}
          />
        </div>

        {/* Guests Picker */}
        <div className={cn(s.inputWrapper, s.inputWrapperFull, s.relative)}>
          <SearchInput
            label="Гости"
            value={`${guests} гостя`}
            variant="select"
            onClick={() => setIsGuestsOpen(!isGuestsOpen)}
          />
          
          {isGuestsOpen && (
            <div className={s.popover}>
              <div className={s.guestPicker}>
                <div className={s.guestRow}>
                  <div className={s.guestLabel}>
                    <span className={s.guestTitle}>Взрослые</span>
                    <span className={s.guestSubtitle}>От 13 лет</span>
                  </div>
                  <div className={s.counter}>
                    <button 
                      className={s.counterBtn} 
                      disabled={guests <= 1}
                      onClick={() => dispatch(setGuests(guests - 1))}
                    >
                      <Minus size={16} />
                    </button>
                    <span className={s.counterValue}>{guests}</span>
                    <button 
                      className={s.counterBtn} 
                      onClick={() => dispatch(setGuests(guests + 1))}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <button className={s.searchButton} onClick={handleSearch}>
          <Search size={16} strokeWidth={2.5} />
          <span>Найти</span>
        </button>
      </div>
    </div>
  );
}
