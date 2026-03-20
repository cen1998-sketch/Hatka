"use client";

import { useState } from "react";
import { MOCK_DASHBOARD_LISTINGS } from "@/lib/mock-data";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ListingsTable } from "@/components/dashboard/listings-table";
import { TypeSpecificCard } from "@/components/dashboard/type-specific-card";
import { cn } from "@/lib/utils";
import { Tabs } from "@/components/ui/tabs";
import { FileText, Inbox } from "lucide-react";

const DASHBOARD_TABS = [
  { id: "active", label: "Опубликованные" },
  { id: "pending", label: "На модерации" },
  { id: "drafts", label: "Черновики" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const allListings = MOCK_DASHBOARD_LISTINGS;

  // Filter logic
  const filteredListings = allListings.filter(l => {
    if (activeTab === "active") return l.status === "active";
    if (activeTab === "pending") return l.status === "pending";
    if (activeTab === "drafts") return l.status === "draft";
    return false;
  });

  return (
    <div className="flex flex-col flex-1 w-full bg-neutral-100 min-h-screen">
      <div className="w-full max-w-[1140px] mx-auto pt-10 pb-20 px-4 xl:px-0 flex flex-col gap-10">
        
        <DashboardHeader count={filteredListings.length} />

        <div className="flex flex-col gap-6">
          {/* Status Tabs - Using the pill component */}
          <div className="flex justify-start">
            <Tabs 
              items={DASHBOARD_TABS} 
              activeId={activeTab} 
              onTabChange={setActiveTab} 
            />
          </div>

          {filteredListings.length > 0 ? (
            <div className="flex flex-col gap-10">
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
            <div className="w-full py-32 bg-white rounded-[32px] shadow-sm border border-neutral-100 flex flex-col items-center justify-center gap-4 text-center px-6">
              <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center">
                <Inbox className="w-10 h-10 text-neutral-300" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="text-neutral-900 text-lg font-bold">Ничего не найдено</h4>
                <p className="text-muted-foreground text-sm font-medium">В этом разделе пока нет объявлений</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
