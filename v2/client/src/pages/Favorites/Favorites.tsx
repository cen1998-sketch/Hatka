import { useSelector } from "react-redux";
import { PropertyCard } from "../../entities/property/ui/PropertyCard.tsx";
import { selectAllProperties } from "../../entities/property/model/property-slice.ts";
import { useFavorites } from "../../shared/lib/hooks/use-favorites.ts";
import s from "./Favorites.module.css";

export function Favorites() {
  const allProperties = useSelector(selectAllProperties);
  const { isFavorite } = useFavorites();

  const favoriteProperties = allProperties.filter(p => isFavorite(p.id));

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <div className={s.header}>
          <h1 className={s.title}>Избранное ({favoriteProperties.length})</h1>
        </div>

        {favoriteProperties.length > 0 ? (
          <div className={s.grid}>
            {favoriteProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className={s.emptyState}>
            <h4 className={s.emptyTitle}>Вы пока ничего не добавили</h4>
            <p className={s.emptyDesc}>
              Используйте иконку сердечка на карточках жилья, чтобы сохранить их.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
