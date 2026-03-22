import * as React from "react";
import { Link } from "react-router-dom";
import { Zap, Settings } from "lucide-react";
import { cn } from "../../../shared/lib/clsx.ts";
import s from "./ListingsTable.module.css";
// import Checkbox if needed, or implement native input
// For now native input type checkbox
import type { Property as PropertyDetail } from "../../../entities/property/model/types.ts";

export function ListingRow({ listing }: { listing: PropertyDetail }) {
  const [date, time] = listing.lastModified?.split(",") || ["", ""];

  return (
    <div className={s.row}>
      <div className={s.cellCheckbox}>
        <input type="checkbox" />
      </div>

      <div className={s.cellInfo}>
        <div className={s.thumbBox}>
          {listing.images && listing.images.length > 0 ? (
            <img 
              src={listing.images[0]} 
              alt={listing.title}
              className={s.thumbImg}
            />
          ) : (
             <div className={s.thumbPlaceholder}>
               <span className={s.thumbPlaceholderText}>П</span>
             </div>
          )}
          <span className={s.thumbBadge}>№ {listing.id}</span>
        </div>
        <div className={s.infoTextBox}>
          <Link 
            to={listing.status === "active" ? `/property/${listing.id}?preview=true` : `/dashboard/create/hotel?id=${listing.id}`} 
            className={s.infoTitle}
          >
            {listing.title}
          </Link>
          <p className={s.infoLocation}>{listing.location}</p>
        </div>
      </div>

      <div className={s.cellStatus}>
        <div className={s.statusWrapper}>
          <div className={cn(
            s.statusDot,
            listing.status === "active" ? s.statusDotActive : 
            listing.status === "pending" ? s.statusDotPending : s.statusDotDraft
          )} />
          <span className={s.statusText}>
            {listing.status === "active" ? "Опубликовано" : 
             listing.status === "pending" ? "Ожидает размещения" : "Черновик"}
          </span>
        </div>
      </div>

      <div className={s.cellBooking}>
        <div className={s.bookingBadge}>
          <Zap size={14} fill="#a3a3a3" />
          <span className={s.bookingText}>выкл</span>
        </div>
      </div>

      <div className={s.cellCalendar}>
        <span className={s.dashMark}>—</span>
      </div>

      <div className={s.cellPrice}>
        <span className={s.dashMark}>—</span>
      </div>

      <div className={s.cellModified}>
        <p className={s.modDate}>{date?.trim()}</p>
        <p className={s.modTime}>{time?.trim()}</p>
      </div>

      <div className={s.cellActions}>
        <button className={s.actionBtn}>
          <Settings size={16} color="#737373" />
        </button>
      </div>
    </div>
  );
}

interface ListingsTableProps {
  listings: PropertyDetail[];
  categoryTitle?: string;
}

export function ListingsTable({ listings, categoryTitle }: ListingsTableProps) {
  return (
    <div className={s.container}>
      {categoryTitle && (
        <h2 className={s.categoryTitle}>
          {categoryTitle}
        </h2>
      )}
      <div className={s.tableWrapper}>
        <div className={s.tableHeader}>
          <div />
          <div className={cn(s.headerCell, "pl-4")}>Объявление</div>
          <div className={cn(s.headerCell, s.headerCellCenter)}>Статус объявления</div>
          <div className={cn(s.headerCell, s.headerCellCenter)}>Мгновенное бронирование</div>
          <div className={cn(s.headerCell, s.headerCellCenter)}>Календарь</div>
          <div className={cn(s.headerCell, s.headerCellCenter)}>Цена на сегодня</div>
          <div className={cn(s.headerCell, s.headerCellRight, "pr-4")}>Последнее изменение</div>
          <div />
        </div>

        <div className={s.rowsContainer}>
          {listings.map((listing) => (
            <ListingRow key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
}
