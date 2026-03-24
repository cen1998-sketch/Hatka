import * as React from "react";
import { Link } from "react-router-dom";
import { Zap, Settings, Plus, Building2, MoreHorizontal, Edit, Power, Trash2, FileEdit } from "lucide-react";
import { cn } from "../../../shared/lib/clsx.ts";
import s from "./ListingsTable.module.css";
import type { Property as PropertyDetail } from "../../../entities/property/model/types.ts";
import { 
  useUpdateListingMutation, 
  useDeleteListingMutation, 
  useUpdateRoomMutation, 
  useDeleteRoomMutation 
} from "../../../features/listing-create/api/listingApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ConfirmModal } from "../../../shared/ui/ConfirmModal/ConfirmModal";

function ActionMenu({ onAction, isRoom = false }: { onAction: (action: string) => void, isRoom?: boolean }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={s.actionMenuContainer} ref={menuRef}>
      <button className={s.actionBtn} onClick={() => setIsOpen(!isOpen)}>
        <Settings size={16} color="#737373" />
      </button>
      
      {isOpen && (
        <div className={s.dropdownMenu}>
          <button className={s.menuItem} onClick={() => { onAction('edit'); setIsOpen(false); }}>
            <Edit size={14} /> Редактировать
          </button>
          <button className={s.menuItem} onClick={() => { onAction('draft'); setIsOpen(false); }}>
            <Power size={14} /> Снять с публикации
          </button>
          <button className={s.menuItem} onClick={() => { onAction('copy-draft'); setIsOpen(false); }}>
            <FileEdit size={14} /> В черновик
          </button>
          <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '4px 0' }} />
          <button className={cn(s.menuItem, s.menuItemDanger)} onClick={() => { onAction('delete'); setIsOpen(false); }}>
            <Trash2 size={14} /> Удалить
          </button>
        </div>
      )}
    </div>
  );
}

interface RoomRowProps {
  room: any;
  listing: PropertyDetail;
  onShowConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export function RoomRow({ room, listing, onShowConfirm }: RoomRowProps) {
  const [updateRoom] = useUpdateRoomMutation();
  const [deleteRoom] = useDeleteRoomMutation();
  
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
            room.status === "APPROVED" || room.status === "ACTIVE" ? s.statusDotActive : 
            room.status === "PENDING" ? s.statusDotPending : s.statusDotDraft
          )} />
          <span className={s.statusText}>
            {room.status === "APPROVED" || room.status === "ACTIVE" ? "Опубликовано" : 
             room.status === "PENDING" ? "На модерации" : 
             room.status === "REJECTED" ? "Отклонено" : "Черновик"}
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
        <ActionMenu onAction={async (action) => {
          if (action === 'edit') {
            window.location.href = `/dashboard/create/hotel/${listing.id}?roomId=${room.id}`;
            return;
          }
          if (action === 'draft' || action === 'copy-draft') {
            onShowConfirm(
              'Снять номер с публикации?',
              'Этот номер перестанет отображаться для гостей и перейдет в раздел черновиков.',
              async () => {
                await updateRoom({ roomId: room.id, data: { status: 'DRAFT' } }).unwrap();
              }
            );
            return;
          }
          if (action === 'delete') {
            onShowConfirm(
              'Удалить номер?',
              'Вы уверены, что хотите безвозвратно удалить этот номер? Это действие нельзя отменить.',
              async () => {
                await deleteRoom(room.id).unwrap();
              }
            );
          }
        }} isRoom />
      </div>
    </div>
  );
}

interface ListingsTableProps {
  listing: PropertyDetail;
  categoryTitle?: string;
}

export function ListingsTable({ listing, categoryTitle, filterStatus }: ListingsTableProps & { filterStatus?: string }) {
  const [updateListing] = useUpdateListingMutation();
  const [deleteListing] = useDeleteListingMutation();
  const [updateRoom] = useUpdateRoomMutation();
  const [deleteRoom] = useDeleteRoomMutation();

  const [confirmConfig, setConfirmConfig] = React.useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmConfig({ isOpen: true, title, message, onConfirm });
  };

  let rooms = (listing as any).rooms || [];
  
  // Если передан фильтр, показываем только подходящие номера
  if (filterStatus) {
    rooms = rooms.filter((r: any) => {
      // Маппинг для консистентности (на фронте ACTIVE, в базе APPROVED)
      const mappedStatus = r.status === 'APPROVED' ? 'ACTIVE' : r.status;
      return mappedStatus === filterStatus;
    });
  }

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
            <Link to={`/dashboard/create/hotel/${listing.id}?step=4`} className={s.addRoomBtn}>
              <Plus size={16} />
              Добавить номер
            </Link>
            <ActionMenu onAction={async (action) => {
              if (action === 'edit') {
                window.location.href = `/dashboard/create/hotel/${listing.id}`;
                return;
              }
              if (action === 'draft' || action === 'copy-draft') {
                showConfirm(
                  'Снять все здание с публикации?',
                  'Все номера в этом здании перестанут отображаться для гостей и перейдут в черновики.',
                  async () => {
                    await updateListing({ id: listing.id, data: { status: 'DRAFT' } }).unwrap();
                  }
                );
                return;
              }
              if (action === 'delete') {
                showConfirm(
                  'Удалить всё здание?',
                  'Вы уверены, что хотите безвозвратно удалить это здание со всеми его номерами?',
                  async () => {
                    await deleteListing(listing.id).unwrap();
                  }
                );
              }
            }} />
          </div>

          <ConfirmModal 
            isOpen={confirmConfig.isOpen}
            title={confirmConfig.title}
            message={confirmConfig.message}
            onConfirm={confirmConfig.onConfirm}
            onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
          />
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
              <RoomRow 
                key={room.id} 
                room={room} 
                listing={listing} 
                onShowConfirm={showConfirm}
              />
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
