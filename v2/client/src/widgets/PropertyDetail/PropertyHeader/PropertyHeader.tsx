import * as React from "react";
import { MapPin, Zap } from "lucide-react";
import s from "./PropertyHeader.module.css";

interface PropertyHeaderProps {
  title: string;
  tags: string[];
}

export function PropertyHeader({ title, tags }: PropertyHeaderProps) {
  return (
    <div className={s.header}>
      <div className={s.titleSection}>
        <h1 className={s.title}>{title}</h1>
        <div className={s.tags}>
          {tags.map((tag, i) => (
            <div key={i} className={s.tag}>
              {tag}
            </div>
          ))}
        </div>
      </div>

      <div className={s.infoBlocks}>
        <div className={s.infoBlock}>
          <div className={s.iconWrapper}>
            <Zap size={32} color="#fb923c" fill="#fb923c" />
          </div>
          <div className={s.blockContent}>
            <h3 className={s.blockTitle}>Быстрое бронирование</h3>
            <p className={s.blockDesc}>
              Всего 2 минуты, без ожидания ответа от хозяина, будет доступно после авторизации
            </p>
          </div>
        </div>

        <div className={s.infoBlock}>
          <div className={s.iconWrapper}>
            <MapPin size={32} color="#60a5fa" />
          </div>
          <div className={s.blockContent}>
            <h3 className={s.blockTitle}>Посмотреть на карте</h3>
            <p className={s.blockDesc}>
              Уютный район и точный адрес. Кликни карту — покажем всё сверху наглядно!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
