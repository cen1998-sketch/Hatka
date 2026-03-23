import * as React from "react";
import { Input } from "../../../shared/ui/Input/Input";

interface PropertyLocationFormProps {
  city?: string;
  streetType?: string;
  streetName?: string;
  houseNumber?: string;
  buildingBlock?: string;
  mode?: 'addressGrid';
  onChange: (data: any) => void;
}

const STREET_TYPES = [
  "Улица", "Проспект", "Переулок", "Бульвар", "Шоссе", "Площадь", "Проезд", "Набережная"
];

export const PropertyLocationForm: React.FC<PropertyLocationFormProps> = ({
  city = "",
  streetType = "Улица",
  streetName = "",
  houseNumber = "",
  buildingBlock = "",
  mode = 'addressGrid',
  onChange
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[160px,1fr] gap-6">
        <select 
          value={streetType}
          onChange={(e) => onChange({ streetType: e.target.value })}
          className="h-12 px-4 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius)] text-sm font-medium outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
        >
          {STREET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <Input
          placeholder="Название улицы"
          value={streetName}
          onChange={(e) => onChange({ streetName: e.target.value })}
          className="h-12 border-[var(--border)] bg-[var(--background)]"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Input
          placeholder="Дом"
          value={houseNumber}
          onChange={(e) => onChange({ houseNumber: e.target.value })}
          className="h-12 border-[var(--border)] bg-[var(--background)]"
        />
        <Input
          placeholder="Корпус"
          value={buildingBlock}
          onChange={(e) => onChange({ buildingBlock: e.target.value })}
          className="h-12 border-[var(--border)] bg-[var(--background)]"
        />
      </div>
    </div>
  );
};
