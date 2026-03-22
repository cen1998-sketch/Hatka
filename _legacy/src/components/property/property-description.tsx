"use client";

import { useState } from "react";

interface PropertyDescriptionProps {
  text: string;
}

export function PropertyDescription({ text }: PropertyDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full p-6 bg-white rounded-xl flex flex-col items-start gap-4">
      <div className={`text-neutral-950 text-xs font-medium leading-4 whitespace-pre-line ${!isExpanded && "line-clamp-6"}`}>
        {text}
      </div>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-orange-500 text-xs font-medium hover:underline"
      >
        {isExpanded ? "Скрыть" : "Показать полностью"}
      </button>
    </div>
  );
}
