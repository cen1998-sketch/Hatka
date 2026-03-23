import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useSearchListingsQuery } from "../../features/search-listings/api/searchApi.ts";
import { PropertyCard } from "../../entities/property/ui/PropertyCard.tsx";
import { SearchPanel } from "../../widgets/SearchPanel";
import { PropertyMap } from "../../widgets/PropertyMap/PropertyMap.tsx";
import { cn } from "../../shared/lib/clsx.ts";
import s from "./Search.module.css";

export function Search() {
  const location = useLocation();
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Извлекаем параметры из URL
  const queryParams = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return Object.fromEntries(params.entries());
  }, [location.search]);

  const { data, isLoading } = useSearchListingsQuery(queryParams);
  const listings = data?.data?.listings || [];
  const total = data?.data?.total || 0;

  return (
    <div className={s.searchPage}>
      <div className={s.headerSticky}>
        <div className={s.container}>
          <SearchPanel />
        </div>
      </div>

      <div className={s.container}>
        <div className={s.contentWrapper}>
          
          <div className={s.resultsArea}>
            <div className={s.resultsInfo}>
              {isLoading ? "Загрузка..." : `Найдено ${total} вариантов жилья`}
            </div>

            <div className={cn(s.listingGrid, isMapExpanded ? s.singleCol : "")}>
              {listings.length === 0 && !isLoading ? (
                <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.6 }}>
                  По вашему запросу ничего не найдено. Попробуйте изменить фильтры.
                </div>
              ) : (
                listings.map((item: any) => (
                  <div 
                    key={item.id} 
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={s.cardWrapper}
                  >
                    <PropertyCard property={item} />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={cn(s.mapArea, isMapExpanded ? s.expanded : "")}>
            <div className={s.stickyMap}>
              <PropertyMap 
                properties={listings} 
                activeId={hoveredId} 
                isExpanded={isMapExpanded}
              />
              <button 
                className={s.mapToggle}
                onClick={() => setIsMapExpanded(!isMapExpanded)}
              >
                {isMapExpanded ? "Свернуть карту" : "Раскрыть карту"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
