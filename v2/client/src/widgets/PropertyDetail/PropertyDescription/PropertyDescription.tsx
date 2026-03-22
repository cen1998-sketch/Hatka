import * as React from "react";
import { cn } from "../../../shared/lib/clsx.ts";
import s from "./PropertyDescription.module.css";

interface PropertyDescriptionProps {
  text: string;
}

export function PropertyDescription({ text }: PropertyDescriptionProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className={s.container}>
      <div className={cn(s.text, !isExpanded && s.textCollapsed)}>
        {text}
      </div>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={s.toggleBtn}
      >
        {isExpanded ? "Скрыть" : "Показать полностью"}
      </button>
    </div>
  );
}
