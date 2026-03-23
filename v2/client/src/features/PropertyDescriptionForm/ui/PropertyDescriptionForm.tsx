import * as React from "react";
import { cn } from "../../../shared/lib/clsx";

interface PropertyDescriptionFormProps {
  description?: string;
  onChange: (data: { description: string }) => void;
}

export const PropertyDescriptionForm: React.FC<PropertyDescriptionFormProps> = ({
  description = "",
  onChange
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm leading-relaxed">
        <p className="text-[var(--muted-foreground)]">
          Гости бронируют объекты с подробным описанием на 25% чаще. 
          <span className="text-[var(--foreground)] font-bold ml-1 cursor-pointer hover:underline">На что смотрят гости →</span>
        </p>
      </div>

      <div className="relative">
        <textarea
          className={cn(
            "min-h-[280px] w-full border border-[var(--border)] bg-[var(--background)] p-5 text-[var(--foreground)] text-base leading-relaxed transition-all placeholder:text-[var(--muted-foreground)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          )}
          style={{ borderRadius: 'var(--radius)' }}
          placeholder="Расскажите подробнее о своём объекте, его особенностях и преимуществах..."
          value={description}
          onChange={(e) => onChange({ description: e.target.value })}
        />
        
        <div className="mt-3 flex items-center justify-end text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest">
          {description.length} / 2500
        </div>
      </div>
    </div>
  );
};
