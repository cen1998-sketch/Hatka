import * as React from "react";
import { Link } from "react-router-dom";
import { Bed, Building2, Home, DoorOpen, ChevronLeft } from "lucide-react";
import { CategoryCard } from "../../widgets/CreateListing/CategoryCard/CategoryCard.tsx";
import s from "./CreateListing.module.css";

export function CreateListing() {
  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        
        <div className={s.backRow}>
          <Link to="/dashboard" className={s.backBtn}>
            <ChevronLeft size={16} />
            Назад в кабинет
          </Link>
        </div>

        <div className={s.header}>
          <h1 className={s.headerTitle}>Сдавайте своё жильё на Хатка</h1>
          <p className={s.headerSubtitle}>
            Бесплатное размещение объявлений, оплата только за успешные бронирования
          </p>
        </div>

        <div className={s.content}>
          <h2 className={s.sectionTitle}>Что будете сдавать?</h2>
          
          <div className={s.grid}>
            <Link to="/dashboard/create/hotel?type=Гостиница" className={s.cardLink}>
              <CategoryCard 
                icon={<Building2 size={40} />}
                title="номера, спальные места"
                subtitle="в отеле, гостевом доме или хостеле"
                description="Гостям будет предоставлен номер в отеле, гостевом доме или отдельное спальное место в хостеле"
              />
            </Link>
            <Link to="/dashboard/create/hotel?type=Квартира" className={s.cardLink}>
              <CategoryCard 
                icon={<Bed size={40} />}
                title="квартиры, апартаменты"
                subtitle="целиком"
                description="Гости снимут квартиру целиком. Вместе со всеми удобствами и кухней"
              />
            </Link>
            <Link to="/dashboard/create/hotel?type=Дом" className={s.cardLink}>
              <CategoryCard 
                icon={<Home size={40} />}
                title="дома, коттеджи"
                subtitle="целиком"
                description="Гости снимут дом целиком. Вместе с пристройками и придомовой территорией"
              />
            </Link>
            <Link to="/dashboard/create/hotel?type=Комната" className={s.cardLink}>
              <CategoryCard 
                icon={<DoorOpen size={40} />}
                title="отдельные комнаты"
                subtitle="целиком"
                description="Гости снимут отдельную комнату со спальным местом в вашем жилье"
              />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
