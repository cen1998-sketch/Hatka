import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProperties, selectAllProperties, selectPropertyStatus } from "../../entities/property/model/property-slice.ts";
import { PropertyCard } from "../../entities/property/ui/PropertyCard.tsx";
import { Skeleton } from "../../shared/ui/Skeleton/Skeleton.tsx";
import { SearchBar } from "../../widgets/SearchBar/SearchBar.tsx";
import { TitleBar } from "../../shared/ui/TitleBar/TitleBar.tsx";
import { Sidebar } from "../../widgets/Sidebar/Sidebar.tsx";
import { SpecialPicks } from "../../widgets/SpecialPicks/SpecialPicks.tsx";
import type { AppDispatch } from "../../app/store.ts";
import s from "./Home.module.css";

export function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const properties = useSelector(selectAllProperties);
  const status = useSelector(selectPropertyStatus);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProperties());
    }
  }, [status, dispatch]);

  return (
    <div className={s.home}>
      <div className={s.container}>
        <div className={s.searchWrapper}>
          <SearchBar />
        </div>
        
        <div className={s.titleWrapper}>
          <TitleBar />
        </div>

        <div className={s.contentRow}>
          {/* Sidebar Area */}
          <aside className={s.sidebarWrapper}>
            <Sidebar />
          </aside>

          {/* Main Content Area */}
          <main className={s.mainContent}>
            <SpecialPicks />
            
            <div className={s.listingGrid}>
              {status === 'loading' ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} style={{ height: '400px', width: '100%', borderRadius: '1rem', overflow: 'hidden' }}>
                    <Skeleton className="h-full w-full" />
                  </div>
                ))
              ) : (
                properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
