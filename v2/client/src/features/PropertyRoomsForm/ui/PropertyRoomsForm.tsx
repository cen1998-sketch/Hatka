import * as React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../../../shared/ui/Button/Button";
import { Input } from "../../../shared/ui/Input/Input";
import { Label } from "../../../shared/ui/Label/Label";
import type { Room } from "../../../entities/property/model/types";
import { cn } from "../../../shared/lib/clsx";

interface PropertyRoomsFormProps {
  rooms: Room[];
  onChange: (data: { hotelRooms: Room[] }) => void;
}

export const PropertyRoomsForm: React.FC<PropertyRoomsFormProps> = ({
  rooms = [],
  onChange
}) => {
  const addRoom = () => {
    const newRoom: Room = {
      title: "",
      pricePerNight: 0,
      capacity: 2,
      beds: 1,
      area: 20
    };
    onChange({ hotelRooms: [...rooms, newRoom] });
  };

  const updateRoom = (index: number, data: Partial<Room>) => {
    const newRooms = [...rooms];
    newRooms[index] = { ...newRooms[index], ...data };
    onChange({ hotelRooms: newRooms });
  };

  const removeRoom = (index: number) => {
    onChange({ hotelRooms: rooms.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {rooms.map((room, idx) => (
          <div
            key={idx}
            className="group relative border border-gray-200 bg-white p-6 rounded-lg"
          >
            <button
              onClick={() => removeRoom(idx)}
              className="absolute right-4 top-4 text-gray-400 hover:text-red-600 transition-colors p-1"
              title="Удалить категорию"
            >
              <Trash2 size={18} />
            </button>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">Название категории <span className="text-[var(--primary)]">*</span></Label>
                <Input
                  placeholder="Например: Люкс с видом на море"
                  value={room.title}
                  onChange={(e) => updateRoom(idx, { title: e.target.value })}
                  className="h-11 border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">Цена за ночь (₽) <span className="text-[var(--primary)]">*</span></Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={room.pricePerNight || room.price || 0}
                  onChange={(e) => updateRoom(idx, { pricePerNight: Number(e.target.value) })}
                  className="h-11 border-gray-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 md:col-span-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-500">Гостей <span className="text-[var(--primary)]">*</span></Label>
                  <Input
                    type="number"
                    value={room.capacity}
                    onChange={(e) => updateRoom(idx, { capacity: Number(e.target.value) })}
                    className="h-11 border-gray-200 text-center"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-500">Кроватей</Label>
                  <Input
                    type="number"
                    value={room.beds}
                    onChange={(e) => updateRoom(idx, { beds: Number(e.target.value) })}
                    className="h-11 border-gray-200 text-center"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-500">Площадь (м²)</Label>
                  <Input
                    type="number"
                    value={room.area}
                    onChange={(e) => updateRoom(idx, { area: Number(e.target.value) })}
                    className="h-11 border-gray-200 text-center"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {rooms.length === 0 && (
          <div className="border border-dashed border-gray-300 py-12 rounded-lg bg-gray-50/50 flex flex-col items-center justify-center text-center">
            <h3 className="text-gray-900 font-bold mb-1">Ещё нет категорий номеров</h3>
            <p className="text-sm text-gray-500 mb-6">Добавьте типы номеров, которые есть в вашем объекте</p>
          </div>
        )}
      </div>

      <Button
        onClick={addRoom}
        className="w-full md:w-auto h-11 px-6 text-[var(--primary)] hover:bg-orange-50 border border-[var(--primary)] rounded-lg font-bold gap-2 transition-all flex items-center justify-center"
      >
        <Plus size={18} />
        Добавить категорию номера
      </Button>
    </div>
  );
};
