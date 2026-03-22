import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAllProperties, fetchSearchProperties } from "../../entities/property/model/property-slice.ts";
import { PropertyCard } from "../../entities/property/ui/PropertyCard.tsx";
import { SearchBar } from "../../widgets/SearchBar/SearchBar.tsx";
import { Sidebar } from "../../widgets/Sidebar/Sidebar.tsx";
import { PropertyMap } from "../../widgets/PropertyMap/PropertyMap.tsx";
import { cn } from "../../shared/lib/clsx.ts";
import type { RootState, AppDispatch } from "../../app/store.ts";
import s from "./Search.module.css";

export function Search() {
  const dispatch = useDispatch<AppDispatch>();
  const properties = useSelector(selectAllProperties);
  const searchParams = useSelector((state: RootState) => state.search);
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [isMapExpanded, setIsMapExpanded] = React.useState(false);

  // Живой поиск при изменении любых параметров
  React.useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchSearchProperties(searchParams));
    }, 400); // Небольшой дебаунс для плавности

    return () => clearTimeout(timer);
  }, [dispatch, searchParams]);

  return (
    <div className={s.searchPage}>
      {/* Sticky Top Bar */}
      <div className={s.headerSticky}>
        <div className={s.container}>
          <SearchBar />
        </div>
      </div>

      <div className={s.container}>
        <div className={s.contentWrapper}>
          
          {/* Left Sidebar */}
          <aside className={s.sidebar}>
            <Sidebar />
          </aside>

          {/* Center Results */}
          <div className={s.resultsArea}>
            {/* Sorting Toolbar */}
            <div className={s.toolbar}>
              <button className={cn(s.toolBtn, s.active)}>По популярности</button>
              <button className={s.toolBtn}>По рейтингу</button>
              <button className={s.toolBtn}>Сначала дешевле</button>
            </div>

            <div className={s.resultsInfo}>
              Найдено {properties.length} вариантов жилья
            </div>

            {/* List - Single Column as requested */}
            <div className={cn(s.listingGrid, isMapExpanded ? s.singleCol : "")}>
              {properties.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.6 }}>
                  По вашему запросу ничего не найдено. Попробуйте изменить фильтры.
                </div>
              ) : (
                properties.map((prop) => (
                  <div 
                    key={prop.id} 
                    onMouseEnter={() => setHoveredId(prop.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={s.cardWrapper}
                  >
                    <PropertyCard property={prop} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Map */}
          <div className={cn(s.mapArea, isMapExpanded ? s.expanded : "")}>
            <div className={s.stickyMap}>
              <PropertyMap 
                properties={properties} 
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
