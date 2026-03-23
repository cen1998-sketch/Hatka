import * as React from "react";
import { Label } from "../../../shared/ui/Label/Label";
import { cn } from "../../../shared/lib/clsx";

interface PropertyRulesFormProps {
  checkIn?: string;
  checkOut?: string;
  smoking?: string;
  paymentMethod?: string;
  mode?: 'timesOnly' | 'paymentOnly' | 'smokingOnly';
  onChange: (data: any) => void;
}

export const PropertyRulesForm: React.FC<PropertyRulesFormProps> = ({
  checkIn = "14:00",
  checkOut = "12:00",
  smoking = 'FORBIDDEN',
  paymentMethod = 'CASH_AND_CARD',
  mode = 'timesOnly',
  onChange
}) => {
  if (mode === 'timesOnly') {
    return (
      <div className="grid grid-cols-2 gap-8 max-w-md">
        <div className="space-y-1">
          <div className="relative">
            <Label className="absolute -top-2 left-4 px-2 bg-white text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest z-10">Заезд после</Label>
            <select 
              value={checkIn}
              onChange={(e) => onChange({ checkIn: e.target.value })}
              className="w-full h-11 px-6 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius)] text-sm font-medium outline-none appearance-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
            >
              {Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' : ''}${i}:00`).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-1">
          <div className="relative">
            <Label className="absolute -top-2 left-4 px-2 bg-white text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-widest z-10">Выезд до</Label>
            <select 
              value={checkOut}
              onChange={(e) => onChange({ checkOut: e.target.value })}
              className="w-full h-11 px-6 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius)] text-sm font-medium outline-none appearance-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
            >
              {Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' : ''}${i}:00`).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'paymentOnly' || mode === 'smokingOnly') {
    const value = mode === 'paymentOnly' ? paymentMethod : smoking;
    const field = mode === 'paymentOnly' ? 'paymentMethod' : 'smoking';
    
    const options = mode === 'paymentOnly' ? [
      { id: 'CASH_ONLY', label: 'Только наличные' },
      { id: 'CARD_ONLY', label: 'Только кредитные карты' },
      { id: 'CASH_AND_CARD', label: 'Наличные и карты' },
      { id: 'ANY', label: 'Любой способ' }
    ] : [
      { id: 'FORBIDDEN', label: 'Запрещено' },
      { id: 'DESIGNATED_AREAS', label: 'Разрешено в специально отведённых местах' },
      { id: 'ALLOWED', label: 'Разрешено везде' }
    ];

    return (
      <div className="space-y-4">
        {options.map(opt => (
          <label key={opt.id} className="flex items-center gap-4 cursor-pointer group">
            <div className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
              value === opt.id ? "border-[var(--primary)]" : "border-[var(--border)] bg-[var(--background)]"
            )}>
              {value === opt.id && <div className="w-3.5 h-3.5 rounded-full bg-[var(--primary)]" />}
            </div>
            <input 
              type="radio" 
              className="hidden" 
              checked={value === opt.id}
              onChange={() => onChange({ [field]: opt.id })}
            />
            <span className="text-sm text-[var(--foreground)] font-medium group-hover:text-[var(--primary)] transition-colors">{opt.label}</span>
          </label>
        ))}
      </div>
    );
  }

  return null;
};
