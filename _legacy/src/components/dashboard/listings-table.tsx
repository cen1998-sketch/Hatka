"use client";

import { PropertyDetail } from "@/lib/types";
import { ListingRow } from "./listing-row";
import { Checkbox } from "@/components/ui/checkbox";

interface ListingsTableProps {
  listings: PropertyDetail[];
  categoryTitle?: string;
}

export function ListingsTable({ listings, categoryTitle }: ListingsTableProps) {
  return (
    <div className="flex flex-col gap-5">
      {categoryTitle && (
        <h2 className="text-neutral-900 text-xl font-extrabold uppercase tracking-tight pl-2">
          {categoryTitle}
        </h2>
      )}
      <div className="w-full bg-white rounded-[32px] overflow-hidden shadow-sm border border-neutral-100">
        {/* Table Header */}
        <div className="grid grid-cols-[48px_1fr_180px_120px_100px_100px_140px_48px] px-6 py-4 bg-white border-b border-neutral-100 items-center">
          <div /> {/* Removed Checkbox from header per user request */}
          <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider pl-4">Объявление</div>
          <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider text-center">Статус объявления</div>
          <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider text-center">Мгновенное бронирование</div>
          <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider text-center">Календарь</div>
          <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider text-center">Цена на сегодня</div>
          <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider text-right pr-4">Последнее изменение</div>
          <div />
        </div>

      {/* Table Body */}
      <div className="flex flex-col">
        {listings.map((listing) => (
          <ListingRow key={listing.id} listing={listing} />
        ))}
      </div>
      </div>
    </div>
  );
}
