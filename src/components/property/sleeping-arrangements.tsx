"use client";

import { Bed, Sofa, User } from "lucide-react";

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
      case "double-bed": return <Bed className="w-4 h-4" />;
      case "sofa-bed": return <Sofa className="w-4 h-4" />;
      case "single-bed": return <User className="w-4 h-4" />;
      default: return <Bed className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-xl flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-neutral-950 text-xl font-semibold leading-7">Спальные места</h2>
        <p className="text-muted-foreground text-xs font-medium leading-4">{summary}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {items.map((item, i) => (
          <div key={i} className="p-3 bg-gray-100 rounded-lg flex items-center gap-1.5">
            {getIcon(item.type)}
            <span className="text-neutral-950 text-xs font-medium leading-4">
              {item.title} х {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
