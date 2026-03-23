import * as React from "react";
import { Input } from "../../../shared/ui/Input/Input";
import { Label } from "../../../shared/ui/Label/Label";
import { cn } from "../../../shared/lib/clsx";

interface PropertyBasicInfoFormProps {
  title?: string;
  type?: string;
  subType?: string;
  starRating?: number;
  mode?: 'titleOnly' | 'typeCategory' | 'additionalInfo';
  onChange: (data: any) => void;
}

export const PropertyBasicInfoForm: React.FC<PropertyBasicInfoFormProps> = ({
  title = "",
  type = "HOTEL_ROOM",
  subType = "",
  starRating = 0,
  mode = 'titleOnly',
  onChange
}) => {
  if (mode === 'titleOnly') {
    return (
      <div className="space-y-4">
        <Input
          placeholder="Название"
          value={title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="h-12 border-none ring-1 ring-[var(--border)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
        />
        <p className="text-xs text-[var(--muted-foreground)]">
          это название будут видеть гости при поиске (если у вас нет названия, можете указать название улицы, номер дома)
        </p>
      </div>
    );
  }

  if (mode === 'typeCategory') {
    return (
      <div className="space-y-6">
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-4">
          Внесите информацию о вашем объекте из <a href="#" className="text-blue-500 underline hover:text-blue-600 transition-colors">Единого реестра</a>. 
          После успешной проверки мы разместим эти данные для гостей
        </p>
        
        <div className="grid grid-cols-[1fr,240px] items-center gap-6">
          <Label className="text-sm text-[var(--foreground)] font-medium">Номер реестровой записи*</Label>
          <Input 
            placeholder="" 
            className="h-10 border-[var(--border)] bg-[var(--background)]" 
          />
        </div>

        <div className="grid grid-cols-[1fr,240px] items-center gap-6">
          <Label className="text-sm text-[var(--foreground)] font-medium">Категория средства размещения (звёзды)</Label>
          <select 
            value={starRating}
            onChange={(e) => onChange({ starRating: Number(e.target.value) })}
            className="h-10 px-3 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius)] text-sm outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
          >
            <option value={0}>выберите</option>
            <option value={1}>1 звезда</option>
            <option value={2}>2 звезды</option>
            <option value={3}>3 звезды</option>
            <option value={4}>4 звезды</option>
            <option value={5}>5 звезд</option>
          </select>
        </div>

        <div className="grid grid-cols-[1fr,240px] items-center gap-6">
          <Label className="text-sm text-[var(--foreground)] font-medium">Тип средства размещения (по реестру)</Label>
          <Input 
            placeholder="" 
            className="h-10 border-[var(--border)] bg-[var(--background)]" 
          />
        </div>
      </div>
    );
  }

  if (mode === 'additionalInfo') {
    return (
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label className="text-xs text-[var(--muted-foreground)] ml-1 font-bold uppercase tracking-wider">год постройки</Label>
          <select 
            className="w-full h-11 px-3 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius)] text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option>выберите</option>
            {Array.from({ length: 50 }, (_, i) => 2024 - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-[var(--muted-foreground)] ml-1 font-bold uppercase tracking-wider">Количество номеров</Label>
          <Input 
            type="number"
            placeholder="0"
            className="h-11 border-[var(--border)] bg-[var(--background)]"
          />
        </div>
      </div>
    );
  }

  return null;
};
