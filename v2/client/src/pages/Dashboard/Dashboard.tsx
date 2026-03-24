import * as React from "react";
import { Inbox } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { DashboardHeader } from "../../widgets/Dashboard/DashboardHeader/DashboardHeader.tsx";
import { cn } from "../../shared/lib/clsx.ts";
import { ListingsTable } from "../../widgets/Dashboard/ListingsTable/ListingsTable.tsx";
import { Tabs } from "../../shared/ui/Tabs/Tabs.tsx";
import s from "./Dashboard.module.css";
import type { Property as PropertyDetail } from "../../entities/property/model/types.ts";
import type { AppDispatch, RootState } from "../../app/store.ts";
import { useGetMyListingsQuery, useGetOwnerBookingsQuery } from "../../features/listing-create/api/listingApi.ts";

const DASHBOARD_TABS = [
  { id: "ACTIVE", label: "Опубликованные" },
  { id: "PENDING", label: "На модерации" },
  { id: "DRAFT", label: "Черновики" },
  { id: "REJECTED", label: "Отклоненные" },
];

export function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = React.useState("PENDING");
  
  // RTK Query с авто-обновлением каждые 10 секунд
  const { data: listingsData } = useGetMyListingsQuery(undefined, {
    pollingInterval: 10000,
    refetchOnFocus: true
  });
  const { data: bookingsData } = useGetOwnerBookingsQuery(undefined, {
    pollingInterval: 10000,
    refetchOnFocus: true
  });

  const allListings = listingsData?.data || [];
  const ownerBookings = bookingsData?.data || [];
  
  // Состояние для маркеров (какие вкладки имеют "новые" изменения)
  const [tabMarkers, setTabMarkers] = React.useState<Record<string, boolean>>({});

  // Логика маркеров: проверяем изменения с момента последнего визита во вкладку
  React.useEffect(() => {
    const lastVisits = JSON.parse(localStorage.getItem('dashboard_last_visits') || '{}');
    const newMarkers: Record<string, boolean> = {};

    DASHBOARD_TABS.forEach(tab => {
      if (tab.id === activeTab) return; // Текущая вкладка не помечается маркером

      const lastVisit = lastVisits[tab.id] || 0;
      // Ищем хоть один объект или номер во вкладке, который обновился позже последнего визита
      const hasNew = allListings.some((l: any) => {
        const listingStatus = (l.status as string) === 'APPROVED' ? 'ACTIVE' : l.status;
        const matchesListing = listingStatus === tab.id && new Date(l.updatedAt || 0).getTime() > lastVisit;
        
        const hasNewRoom = (l as any).rooms?.some((r: any) => {
          const roomStatus = (r.status as string) === 'APPROVED' ? 'ACTIVE' : r.status;
          return roomStatus === tab.id && new Date(r.updatedAt || 0).getTime() > lastVisit;
        });

        return matchesListing || hasNewRoom;
      });

      if (hasNew) newMarkers[tab.id] = true;
    });

    setTabMarkers(newMarkers);
    
    // Обновляем время визита для текущей вкладки
    lastVisits[activeTab] = Date.now();
    localStorage.setItem('dashboard_last_visits', JSON.stringify(lastVisits));
  }, [allListings, activeTab]);

  // Улучшенная фильтрация: показываем листинг если он САМ в этом статусе
  // ИЛИ если у него есть хотя бы один НОМЕР в этом статусе
  const filteredListings = allListings.filter((l: any) => {
    const listingStatus = (l.status as string) === 'APPROVED' ? 'ACTIVE' : l.status;
    if (listingStatus === activeTab) return true;
    
    return (l as any).rooms?.some((r: any) => {
      const roomStatus = (r.status as string) === 'APPROVED' ? 'ACTIVE' : r.status;
      return roomStatus === activeTab;
    });
  });

  const tabsWithMarkers = DASHBOARD_TABS.map(tab => ({
    ...tab,
    hasMarker: tabMarkers[tab.id]
  }));

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        
        <DashboardHeader count={filteredListings.length} />

        <div className={s.content}>
          <div className={s.tabsRow}>
            <Tabs 
              items={tabsWithMarkers} 
              activeId={activeTab} 
              onTabChange={setActiveTab} 
            />
          </div>

          {ownerBookings.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-black text-gray-900 mb-6">Входящие бронирования</h2>
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase">Объект</th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase">Гость</th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase">Даты</th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase">Сумма</th>
                      <th className="p-4 text-xs font-bold text-gray-500 uppercase">Статус</th>
                    </tr>
                  </thead>
                   <tbody>
                    {ownerBookings.map((b: any) => (
                      <tr key={b.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-bold text-sm text-gray-900">{b.property?.title}</td>
                        <td className="p-4 text-sm text-gray-600">{b.user?.name || "Гость"}</td>
                        <td className="p-4 text-sm text-gray-600">
                          {new Date(b.startDate).toLocaleDateString()} — {new Date(b.endDate).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-sm font-bold text-gray-900">{b.totalPrice} ₽</td>
                        <td className="p-4">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                            b.status === 'CONFIRMED' ? "bg-green-100 text-green-700" : 
                            b.status === 'PENDING' ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"
                          )}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredListings.length > 0 ? (
            <div className={s.tablesWrapper}>
              {filteredListings.map((listing: any) => (
                <ListingsTable 
                  key={listing.id}
                  listing={listing} 
                />
              ))}
            </div>
          ) : (
            <div className={s.emptyState}>
              <div className={s.emptyIconBox}>
                <Inbox size={40} color="#d4d4d4" />
              </div>
              <div className={s.emptyStateText}>
                <h4 className={s.emptyStateTitle}>Ничего не найдено</h4>
                <p className={s.emptyStateDesc}>В этом разделе пока нет объявлений</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
