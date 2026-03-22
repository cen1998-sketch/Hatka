import { Link } from "react-router-dom";
import { Button } from "../../shared/ui/Button/Button.tsx";
import s from "./SpecialPicks.module.css";

const SPECIAL_PROPERTIES = [
  { id: "prop-0", title: "Томск, Савиных улица, 4А", price: "3 000", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&q=80" },
  { id: "prop-1", title: "Томск, проспект Ленина, 121", price: "13 000", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&q=80" },
  { id: "prop-2", title: "Томск, улица Кирова, 15", price: "13 000", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=300&q=80" },
  { id: "prop-3", title: "Томск, Комсомольский пр-т", price: "13 000", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&q=80" },
];

export function SpecialPicks() {
  return (
    <div className={s.specialPicks}>
      <div className={s.banner}>
        {/* Banner Background Image */}
        <div className={s.bannerBg}>
           <img 
             src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&q=80"
             alt="Banner BG"
           />
        </div>

        {/* Header inside banner */}
        <div className={s.bannerHeader}>
          <div className={s.bannerTitleWrapper}>
            <h3 className={s.bannerTitle}>Подобрали специально для вас</h3>
            <span className={s.bannerSubtitle}>12 вариантов</span>
          </div>
          <Link to="/search" className={s.allButton}>
            Все
          </Link>
        </div>

        {/* Horizontal List of Cards */}
        <div className={s.list}>
          {SPECIAL_PROPERTIES.map((prop) => (
            <Link key={prop.id} to={`/property/${prop.id}`} className={s.card}>
              <div className={s.cardImageWrapper}>
                <img src={prop.image} alt={prop.title} className={s.cardImage} />
              </div>
              <div className={s.cardContent}>
                <div className={s.cardTitle}>{prop.title}</div>
                <div className={s.cardPriceRow}>
                  <div className={s.cardPrice}>{prop.price} ₽</div>
                  <div className={s.cardPricePeriod}>за 1 сутки</div>
                </div>
              </div>
            </Link>
          ))}

          {/* Promo Card Block */}
          <div className={s.promoCard}>
             <div className={s.promoTitle}>14 дней премиума</div>
             <div className={s.promoText}>
               Делись промокодом с друзьями сейчас!
             </div>
             <div className={s.promoImageWrapper}>
                  <img src="https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=200&q=80" alt="Promo" className={s.promoImage} />
             </div>
             <Button size="sm" style={{ width: '100%', height: '2rem', backgroundColor: '#0a0a0a', borderRadius: '0.75rem', fontSize: '0.75rem' }}>
               Получить
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
