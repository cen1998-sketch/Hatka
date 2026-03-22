import * as React from "react";
import s from "./AmenitiesList.module.css";

interface AmenityGroup {
  title: string;
  items: string[];
}

interface AmenitiesListProps {
  main: string[];
  groups: AmenityGroup[];
}

export function AmenitiesList({ main, groups }: AmenitiesListProps) {
  return (
    <div className={s.container}>
      <div className={s.section}>
        <h2 className={s.titleMain}>Основные удобства</h2>
        <div className={s.mainTags}>
          {main.map((item, i) => (
            <div key={i} className={s.mainTag}>
              {item}
            </div>
          ))}
        </div>
      </div>

      {groups.map((group, i) => (
        <div key={i} className={s.section}>
          <h3 className={s.titleGroup}>{group.title}</h3>
          <div className={s.groupGrid}>
            {group.items.map((item, j) => (
              <p key={j} className={s.itemText}>
                {item}
              </p>
            ))}
          </div>
        </div>
      ))}
      
      {/* "Other amenities" layout variant from design */}
      <div className={s.otherSection}>
        <h3 className={s.titleGroup}>Другие удобства</h3>
        <div className={s.otherGrid}>
          <div className={s.column}>
            <div className={s.subGroup}>
              <h4 className={s.titleSubGroup}>Оснащение</h4>
              <div className={s.subGroupItems}>
                {["Постельное белье", "Стиральная машина", "Беспроводной интернет wi-fi", "Сушилка для белья", "Утюг с гладильной доской"].map((item, i) => (
                  <p key={i} className={s.itemText}>{item}</p>
                ))}
              </div>
            </div>
          </div>
          <div className={s.column}>
            <div className={s.subGroup}>
              <h4 className={s.titleSubGroup}>Для отдыха</h4>
              <p className={s.itemText}>Телевизор</p>
            </div>
            <div className={s.subGroup}>
              <h4 className={s.titleSubGroup}>Ремонт</h4>
              <p className={s.itemText}>Евроремонт</p>
            </div>
          </div>
          <div className={s.column}>
            <div className={s.subGroup}>
              <h4 className={s.titleSubGroup}>Доступность</h4>
              <p className={s.itemText}>Лифт</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
