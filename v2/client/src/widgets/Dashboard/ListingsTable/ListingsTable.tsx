import * as React from "react";
import { Link } from "react-router-dom";
import { Zap, Settings, Plus, Building2 } from "lucide-react";
import { cn } from "../../../shared/lib/clsx.ts";
import s from "./ListingsTable.module.css";
import type { Property as PropertyDetail } from "../../../entities/property/model/types.ts";

export function RoomRow({ room, listing }: { room: any, listing: PropertyDetail }) {
  const modDate = room.updatedAt ? new Date(room.updatedAt).toLocaleString("ru-RU") : "Недавно";
  const [date, time] = modDate.split(",");
  
  const photos = Array.isArray(room.photos) ? room.photos : [];
  const firstPhoto = photos[0]?.url;

  return (
    <div className={s.row}>
      <div className={s.cellCheckbox}>
        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
      </div>

      <div className={s.cellInfo}>
        <div className={s.thumbBox}>
          {firstPhoto ? (
            <img 
              src={firstPhoto.startsWith('http') ? firstPhoto : `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${firstPhoto}`} 
              alt={room.title}
              className={s.thumbImg}
            />
          ) : (
             <div className={s.thumbPlaceholder}>
               <span className={s.thumbPlaceholderText}>{(room.title || room.type || "?")[0].toUpperCase()}</span>
             </div>
          )}
          <span className={s.thumbBadge}>№ {room.id.slice(0, 4)}</span>
        </div>
        <div className={s.infoTextBox}>
          <Link 
            to={`/dashboard/create/hotel/${listing.id}`} 
            className={s.infoTitle}
          >
            {room.title || room.type || "Без названия"}
          </Link>
          <p className={s.infoLocation}>{listing.address || listing.city || "Адрес здания"}</p>
        </div>
      </div>

      <div className={s.cellStatus}>
        <div className={s.statusWrapper}>
          <div className={cn(
            s.statusDot,
            listing.status === "ACTIVE" ? s.statusDotActive : 
            listing.status === "PENDING" ? s.statusDotPending : s.statusDotDraft
          )} />
          <span className={s.statusText}>
            {listing.status === "ACTIVE" ? "Опубликовано" : 
             listing.status === "PENDING" ? "На модерации" : 
             listing.status === "REJECTED" ? "Отклонено" : "Черновик"}
          </span>
        </div>
      </div>

      <div className={s.cellBooking}>
        <div className={s.bookingBadge}>
          <Zap size={14} className={room.instantBooking ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} />
          <span className={s.bookingText}>{room.instantBooking ? "вкл" : "выкл"}</span>
        </div>
      </div>

      <div className={s.cellCalendar}>
        <span className={s.dashMark}>—</span>
      </div>

      <div className={s.cellPrice}>
        <span className="font-bold text-gray-900">{room.pricePerDay || 0} ₽</span>
      </div>

      <div className={s.cellModified}>
        <p className={s.modDate}>{date?.trim()}</p>
        <p className={s.modTime}>{time?.trim()}</p>
      </div>

      <div className={s.cellActions}>
        <Link to={`/dashboard/create/hotel/${listing.id}`} className={s.actionBtn}>
          <Settings size={16} color="#737373" />
        </Link>
      </div>
    </div>
  );
}

interface ListingsTableProps {
  listing: PropertyDetail;
  categoryTitle?: string;
}

export function ListingsTable({ listing, categoryTitle }: ListingsTableProps) {
  const rooms = (listing as any).rooms || [];

  return (
    <div className={s.container}>
      {categoryTitle && (
        <h2 className={s.categoryTitle}>
          {categoryTitle}
        </h2>
      )}
      <div className={s.tableWrapper}>
        <div className={s.tableHeaderTop}>
          <div className={s.buildingInfo}>
            <h2 className={s.buildingName}>
              <Building2 size={20} className="text-blue-600" />
              {listing.title || listing.type}
            </h2>
            <p className={s.buildingAddress}>
              {listing.city}, {listing.address}
            </p>
          </div>
          <div className={s.headerActions}>
            <Link to={`/dashboard/create/hotel/${listing.id}`} className={s.addRoomBtn}>
              <Plus size={16} />
              Добавить номер
            </Link>
            <Link to={`/dashboard/create/hotel/${listing.id}`} className={s.actionBtn}>
              <Settings size={18} color="#737373" />
            </Link>
          </div>
        </div>

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
          {rooms.length > 0 ? (
            rooms.map((room: any) => (
              <RoomRow key={room.id} room={room} listing={listing} />
            ))
          ) : (
            <div className={s.emptyStateInner}>
              <div className={s.emptyStateIcon}>
                <Building2 size={32} />
              </div>
              <h4 className={s.emptyStateTitle}>Номера пока не добавлены</h4>
              <p className={s.emptyStateSubtext}>
                Добавьте категории проживания, чтобы гости смогли увидеть и забронировать ваш объект.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
