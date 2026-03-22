import * as React from "react";
import { Inbox } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { DashboardHeader } from "../../widgets/Dashboard/DashboardHeader/DashboardHeader.tsx";
import { ListingsTable } from "../../widgets/Dashboard/ListingsTable/ListingsTable.tsx";
import { Tabs } from "../../shared/ui/Tabs/Tabs.tsx";
import s from "./Dashboard.module.css";
import type { Property as PropertyDetail } from "../../entities/property/model/types.ts";
import type { AppDispatch, RootState } from "../../app/store.ts";
import { fetchProperties } from "../../entities/property/model/property-slice.ts";

const MOCK_LISTINGS: PropertyDetail[] = [
  {
    id: "1",
    title: "Квартира",
    location: "Ленина, д. 2",
    status: "PENDING",
    lastModified: "19 марта 2026, 13:47",
    propertyType: "Квартира",
    price: "13000",
    basePrice: 13000,
    rating: "9.5",
    reviews: "10",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80"],
  } as unknown as PropertyDetail,
  {
    id: "173897",
    title: "Отель 'Гранд Томск'",
    location: "пр-т Ленина, д. 1",
    status: "PENDING",
    propertyType: "Гостиница",
    lastModified: "20 марта 2026, 11:30",
    price: "5000",
    basePrice: 5000,
    rating: "9.2",
    reviews: "5",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80"]
  } as unknown as PropertyDetail
];

const DASHBOARD_TABS = [
  { id: "ACTIVE", label: "Опубликованные" },
  { id: "PENDING", label: "На модерации" },
  { id: "DRAFT", label: "Черновики" },
  { id: "REJECTED", label: "Отклоненные" },
];

export function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = React.useState("PENDING");
  const { data: allListings, status } = useSelector((state: RootState) => state.property);

  React.useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  // Filter logic
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

          {filteredListings.length > 0 ? (
            <div className={s.tablesWrapper}>
              {filteredListings.some(l => l.propertyType === "Квартира" || !l.propertyType) && (
                <ListingsTable 
                  categoryTitle="Квартиры"
                  listings={filteredListings.filter(l => l.propertyType === "Квартира" || !l.propertyType)} 
                />
              )}

              {filteredListings.some(l => l.propertyType === "Гостиница") && (
                <ListingsTable 
                  categoryTitle="Гостиницы"
                  listings={filteredListings.filter(l => l.propertyType === "Гостиница")} 
                />
              )}

              {filteredListings.some(l => l.propertyType === "Глэмпинг") && (
                <ListingsTable 
                  categoryTitle="Глэмпинг"
                  listings={filteredListings.filter(l => l.propertyType === "Глэмпинг")} 
                />
              )}
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
