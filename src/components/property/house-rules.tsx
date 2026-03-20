"use client";

import { 
  Clock, 
  Ban, 
  Dog, 
  PartyPopper, 
  FileText, 
  Baby,
  ChevronRight
} from "lucide-react";

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
      case "no-smoking": return <Ban className="w-4 h-4" />;
      case "pets": return <Dog className="w-4 h-4" />;
      case "no-parties": return <PartyPopper className="w-4 h-4" />;
      case "no-docs": return <FileText className="w-4 h-4" />;
      case "children": return <Baby className="w-4 h-4" />;
      default: return <Ban className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-xl flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <h2 className="text-neutral-950 text-xl font-semibold leading-7">Правила проживания</h2>
          <p className="text-muted-foreground text-xs font-medium leading-4">{summary}</p>
        </div>
        <div className="px-4 py-1.5 bg-gray-200 rounded-xl inline-flex w-fit">
          <span className="text-neutral-950 text-xs font-medium leading-4">
            Заезд с {checkIn} — Выезд до {checkOut}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {getIcon(item.icon)}
            <span className="text-neutral-950 text-xs font-medium leading-4">{item.text}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <h3 className="text-neutral-950 text-lg font-semibold leading-6">Условия отмены</h3>
        <ChevronRight className="w-4 h-4 text-neutral-950" />
      </div>
    </div>
  );
}
