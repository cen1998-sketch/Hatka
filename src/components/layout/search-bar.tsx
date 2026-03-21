"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

import { useRouter } from "next/navigation";

export function SearchBar() {
  const router = useRouter();
  const [city, setCity] = React.useState("Томск");
  const [date, setDate] = React.useState<any>({
    from: new Date(2026, 5, 19),
    to: new Date(2026, 5, 27),
  });

  return (
    <div className="w-full h-auto md:h-24 p-4 md:p-6 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-[1140px] flex flex-col md:flex-row items-center gap-1">
        {/* Город или адрес */}
        <SearchInput
          label="Город или адрес"
          value={city}
          variant="text"
          placeholder="Бронирование"
          onClear={() => setCity("")}
          onChange={setCity}
          className="flex-1"
        />

        {/* Заезд */}
        <Popover>
          <PopoverTrigger asChild>
            <div className="w-full md:w-32">
              <SearchInput
                label="Заезд"
                value={date?.from ? format(date.from, "d MMM, eee", { locale: ru }) : ""}
                variant="date"
                placeholder="19 июн, пт"
                className="w-full"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-xl" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              locale={ru}
            />
          </PopoverContent>
        </Popover>

        {/* Отъезд */}
        <div className="w-full md:w-32">
          <SearchInput
            label="Отъезд"
            value={date?.to ? format(date.to, "d MMM, eee", { locale: ru }) : ""}
            variant="date"
            placeholder="27 июн, сб"
            className="w-full"
          />
        </div>

        {/* Гости */}
        <SearchInput
          label="Гости"
          value="2 взрослых без детей"
          variant="select"
          className="flex-1"
        />

        {/* Search Button */}
        <Button
          onClick={() => router.push("/search")}
          className="w-full md:w-auto h-11 px-6 bg-orange-500 hover:bg-orange-600 rounded-2xl flex justify-center items-center gap-1.5 text-white text-sm font-medium transition-all"
        >
          <Search className="w-4 h-4 text-white" strokeWidth={2.5} />
          Найти хатку
        </Button>
      </div>
    </div>
  );
}
