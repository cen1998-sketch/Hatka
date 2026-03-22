import * as React from "react";
import { Input } from "../../../shared/ui/Input/Input";
import { Label } from "../../../shared/ui/Label/Label";
import { Star } from "lucide-react";
import { cn } from "../../../shared/lib/clsx";

interface PropertyBasicInfoFormProps {
  title?: string;
  registryNumber?: string;
  starRating?: number;
  registryType?: string;
  buildYear?: number;
  totalRooms?: number;
  onChange: (data: any) => void;
}

export const PropertyBasicInfoForm: React.FC<PropertyBasicInfoFormProps> = ({
  title = "",
  registryNumber = "",
  starRating = 0,
  registryType = "Гостиница",
  buildYear,
  totalRooms,
  onChange
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Основная информация</h2>
        <p className="mt-2 text-gray-500">Заполните данные о вашем объекте для реестра и отображения гостям.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Название объекта (для гостей)</Label>
          <Input
            id="title"
            placeholder="Например, Отель Центральный"
            value={title}
            onChange={(e) => onChange({ title: e.target.value })}
            className="h-12"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="registryNumber">Номер реестровой записи</Label>
            <Input
              id="registryNumber"
              placeholder="0000-0000-00"
              value={registryNumber}
              onChange={(e) => onChange({ registryNumber: e.target.value })}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registryType">Тип по реестру</Label>
            <Input
              id="registryType"
              value={registryType}
              onChange={(e) => onChange({ registryType: e.target.value })}
              className="h-12"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Классификация (Звезды)</Label>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onChange({ starRating: star })}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-all",
                  starRating === star 
                    ? "border-blue-600 bg-blue-50 text-blue-600" 
                    : "border-gray-100 hover:border-gray-200"
                )}
              >
                {star === 0 ? "Без" : <div className="flex items-center gap-0.5">{star}<Star size={14} fill={starRating === star ? "currentColor" : "none"} /></div>}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="buildYear">Год постройки</Label>
            <Input
              id="buildYear"
              type="number"
              placeholder="2020"
              value={buildYear || ""}
              onChange={(e) => onChange({ buildYear: parseInt(e.target.value) || undefined })}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalRooms">Общее кол-во номеров</Label>
            <Input
              id="totalRooms"
              type="number"
              placeholder="50"
              value={totalRooms || ""}
              onChange={(e) => onChange({ totalRooms: parseInt(e.target.value) || undefined })}
              className="h-12"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
