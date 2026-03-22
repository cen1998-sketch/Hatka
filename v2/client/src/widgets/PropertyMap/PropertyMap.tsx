
import s from "./PropertyMap.module.css";

interface PropertyMapProps {
  properties: any[];
  activeId: string | null;
  isExpanded?: boolean;
}

export function PropertyMap({ properties, activeId }: PropertyMapProps) {
  // Using a mock map image for now as per plan, but with interactive elements
  return (
    <div className={s.mapWrapper}>
      <div className={s.mapPlaceholder}>
        <img 
          src="https://api.mapbox.com/styles/v1/mapbox/light-v10/static/84.9744,56.4977,12,0/800x600?access_token=pk.eyJ1IjoiY2VuMTk5OCIsImEiOiJjbHRyeHl6djEwdjZ6MmlwZDZ6Z3Z6Z3Z6In0" 
          alt="Map Placeholder" 
          className={s.mapImage}
        />
        
        {/* Mock Price Tags */}
        {properties.slice(0, 5).map((prop, i) => (
          <div 
            key={prop.id}
            className={`${s.priceTag} ${prop.id === activeId ? s.active : ""}`}
            style={{ 
              top: `${30 + i * 12}%`, 
              left: `${40 + (i % 2) * 20}%` 
            }}
          >
            {prop.price} ₽
          </div>
        ))}
      </div>
      
      <div className={s.overlay}>
        <div className={s.resultsCount}>
          Найдено {properties.length} вариантов
        </div>
      </div>
    </div>
  );
}
