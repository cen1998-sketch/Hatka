import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, CheckCircle } from "lucide-react";
import { cn } from "../../../shared/lib/clsx.ts";
import { useFavorites } from "../../../shared/lib/hooks/use-favorites.ts";
import s from "./PropertyCard.module.css";

interface PropertyCardProps {
  property: any; // Используем any для поддержки как старой Property, так и новой Listing
  className?: string;
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(property.id));
    const handleSync = () => setFavorite(isFavorite(property.id));
    window.addEventListener('favorites-updated', handleSync);
    return () => window.removeEventListener('favorites-updated', handleSync);
  }, [property.id, isFavorite]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
    setFavorite(!favorite);
  };

  // Вычисляем данные из разных моделей (Legacy Property или New Listing)
  const title = property.title || "Без названия";
  const price = property.pricePerDay || property.price || 0;
  const location = property.city || property.location || "Томск";
  
  // Обработка фото: в Listing это массив объектов {url}, в Property - массив строк
  const imageUrl = property.photos?.[0]?.url 
    || property.images?.[0] 
    || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80";

  return (
    <Link to={`/property/${property.id}`} className={cn(s.card, className)}>
      <div className={s.imageWrapper}>
        <img
          src={imageUrl}
          alt={title}
          className={s.image}
        />
      </div>

      <div className={s.topGradient}></div>
      
      <div className={s.locationTag}>
        <CheckCircle size={12} style={{ color: 'white' }} />
        <span className={s.locationText}>{location}</span>
      </div>

      <button
        onClick={handleFavoriteClick}
        className={s.favoriteButton}
      >
        <Heart size={24} className={cn(favorite ? "fill-red-500 text-red-500" : "text-white")} />
      </button>

      <div className={s.bottomGradient}></div>

      <div className={s.bottomContent}>
        <h3 className={s.title}>{title}</h3>
        
        <div className={s.specs}>
          {property.type && (
            <div className={s.specItem}>
              <span className={s.specText}>{property.type}</span>
            </div>
          )}
          {property.details?.rooms && (
            <div className={s.specItem}>
              <span className={s.specText}>{property.details.rooms} комн.</span>
            </div>
          )}
        </div>
        
        <div className={s.priceRow}>
          <div className={s.priceInfo}>
            <div className={s.price}>{price.toLocaleString()} ₽</div>
            <div className={s.pricePeriod}>за 1 сутки</div>
          </div>
          
          <div className={s.scoreWrapper}>
            <div className={s.rating}>
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <div className={s.ratingValue}>{property.avgRating || property.rating || "4.8"}</div>
            </div>
            <div className={s.reviews}>
              <div className={s.reviewsValue}>{property.reviewsCount || property.reviews || "0"} шт</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
