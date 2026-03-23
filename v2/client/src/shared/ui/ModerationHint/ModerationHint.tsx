import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "../../lib/clsx.ts";
import s from "./ModerationHint.module.css";

interface ModerationHintProps {
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function ModerationHint({ error, children, className }: ModerationHintProps) {
  if (!error) return <div className={className}>{children}</div>;

  return (
    <div className={cn(s.container, className)}>
      <div className={s.errorWrapper}>
        {children}
        <div className={s.badge}>
          <AlertCircle size={14} />
          <span>Требует исправления</span>
        </div>
      </div>
      <div className={s.hintBox}>
        <div className={s.hintArrow} />
        <div className={s.hintContent}>
          <AlertCircle size={16} className="text-red-500 shrink-0" />
          <p className={s.hintText}>{error}</p>
        </div>
      </div>
    </div>
  );
}
