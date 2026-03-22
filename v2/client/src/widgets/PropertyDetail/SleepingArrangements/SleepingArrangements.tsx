import * as React from "react";
import { Bed, Sofa, User } from "lucide-react";
import s from "./SleepingArrangements.module.css";

interface SleepingPlace {
  type: "double-bed" | "sofa-bed" | "single-bed";
  title: string;
  count: number;
}

interface SleepingArrangementsProps {
  summary: string;
  items: SleepingPlace[];
}

export function SleepingArrangements({ summary, items }: SleepingArrangementsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "double-bed": return <Bed size={16} />;
      case "sofa-bed": return <Sofa size={16} />;
      case "single-bed": return <User size={16} />;
      default: return <Bed size={16} />;
    }
  };

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h2 className={s.title}>Спальные места</h2>
        <p className={s.summary}>{summary}</p>
      </div>

      <div className={s.itemsList}>
        {items.map((item, i) => (
          <div key={i} className={s.item}>
            {getIcon(item.type)}
            <span className={s.itemText}>
              {item.title} х {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
