import * as React from "react";
import s from "./CategoryCard.module.css";

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
}

export function CategoryCard({ icon, title, subtitle, description }: CategoryCardProps) {
  return (
    <div className={s.card}>
      <div className={s.topRow}>
        <div className={s.iconBox}>
          {icon}
        </div>
        <div className={s.infoBox}>
          <h3 className={s.title}>{title}</h3>
          <p className={s.subtitle}>{subtitle}</p>
        </div>
      </div>
      
      <div className={s.bottomRow}>
        <p className={s.description}>
          {description}
        </p>
      </div>
    </div>
  );
}
