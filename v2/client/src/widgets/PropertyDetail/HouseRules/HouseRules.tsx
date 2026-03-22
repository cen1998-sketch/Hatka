import * as React from "react";
import { 
  Ban, 
  Dog, 
  PartyPopper, 
  FileText, 
  Baby,
  ChevronRight
} from "lucide-react";
import s from "./HouseRules.module.css";

interface HouseRuleItem {
  icon: string;
  text: string;
}

interface HouseRulesProps {
  summary: string;
  checkIn: string;
  checkOut: string;
  items: HouseRuleItem[];
}

export function HouseRules({ summary, checkIn, checkOut, items }: HouseRulesProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "no-smoking": return <Ban size={16} />;
      case "pets": return <Dog size={16} />;
      case "no-parties": return <PartyPopper size={16} />;
      case "no-docs": return <FileText size={16} />;
      case "children": return <Baby size={16} />;
      default: return <Ban size={16} />;
    }
  };

  return (
    <div className={s.container}>
      <div className={s.header}>
        <div className={s.titleBox}>
          <h2 className={s.title}>Правила проживания</h2>
          <p className={s.summary}>{summary}</p>
        </div>
        <div className={s.timesBadge}>
          <span className={s.timesText}>
            Заезд с {checkIn} — Выезд до {checkOut}
          </span>
        </div>
      </div>

      <div className={s.rulesList}>
        {items.map((item, i) => (
          <div key={i} className={s.ruleItem}>
            {getIcon(item.icon)}
            <span className={s.ruleText}>{item.text}</span>
          </div>
        ))}
      </div>

      <div className={s.footer}>
        <h3 className={s.footerTitle}>Условия отмены</h3>
        <ChevronRight size={16} color="#0a0a0a" />
      </div>
    </div>
  );
}
