import * as React from "react";
import { MapPin } from "lucide-react";
import { Input } from "../../../shared/ui/Input/Input";
import { Label } from "../../../shared/ui/Label/Label";

interface PropertyLocationFormProps {
  city?: string;
  streetType?: string;
  streetName?: string;
  houseNumber?: string;
  buildingBlock?: string;
  address?: string; // Legacy/Full address
  onChange: (data: any) => void;
}

export const PropertyLocationForm: React.FC<PropertyLocationFormProps> = ({
  city = "",
  streetType = "улица",
  streetName = "",
  houseNumber = "",
  buildingBlock = "",
  address = "",
  onChange
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Где находится ваш объект?</h2>
        <p className="mt-2 text-gray-500">Укажите точный адрес, чтобы гости могли вас найти.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="city">Город</Label>
          <Input
            id="city"
            placeholder="Например, Москва"
            value={city}
            onChange={(e) => onChange({ city: e.target.value })}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="streetType">Тип улицы</Label>
          <select
            id="streetType"
            value={streetType}
            onChange={(e) => onChange({ streetType: e.target.value })}
            className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <option value="улица">улица</option>
            <option value="проспект">проспект</option>
            <option value="переулок">переулок</option>
            <option value="шоссе">шоссе</option>
            <option value="площадь">площадь</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="streetName">Название улицы</Label>
          <Input
            id="streetName"
            placeholder="Например, Ленина"
            value={streetName}
            onChange={(e) => onChange({ streetName: e.target.value })}
            className="h-12"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="houseNumber">Дом</Label>
            <Input
              id="houseNumber"
              placeholder="10"
              value={houseNumber}
              onChange={(e) => onChange({ houseNumber: e.target.value })}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="buildingBlock">Корпус / Строение</Label>
            <Input
              id="buildingBlock"
              placeholder="1"
              value={buildingBlock}
              onChange={(e) => onChange({ buildingBlock: e.target.value })}
              className="h-12"
            />
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-gray-50 pt-[56.25%]">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
          <MapPin size={48} className="mb-4 opacity-20" />
          <p className="text-sm font-medium">Интерактивная карта (Yandex/2GIS)</p>
          <p className="mt-1 text-xs opacity-60">Местоположение будет определено автоматически по адресу</p>
        </div>
      </div>
    </div>
  );
};
