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
import { fetchMyProperties, fetchOwnerBookings, selectOwnerBookings } from "../../entities/property/model/property-slice.ts";

const DASHBOARD_TABS = [
  { id: "ACTIVE", label: "Опубликованные" },
  { id: "PENDING", label: "На модерации" },
  { id: "DRAFT", label: "Черновики" },
  { id: "REJECTED", label: "Отклоненные" },
];

export function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = React.useState("PENDING");
  const { data: allListings, ownerBookings } = useSelector((state: RootState) => state.property);

  React.useEffect(() => {
    dispatch(fetchMyProperties());
    dispatch(fetchOwnerBookings());
  }, [dispatch]);

  const filteredListings = allListings.filter(l => l.status === activeTab);

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        
        <DashboardHeader count={filteredListings.length} />

        <div className={s.content}>
          <div className={s.tabsRow}>
            <Tabs 
              items={DASHBOARD_TABS} 
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
                    {ownerBookings.map(b => (
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
              {filteredListings.map(listing => (
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
