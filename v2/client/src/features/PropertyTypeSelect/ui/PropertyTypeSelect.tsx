import * as React from "react";
import { Hotel, Building2, Home, Bed } from "lucide-react";
import { RadioGroupCard } from "../../../shared/ui/RadioGroupCard/RadioGroupCard";
import type { PropertyType } from "../../../entities/property/model/types";

interface PropertyTypeOption {
  type: PropertyType;
  subType: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface PropertyTypeSelectProps {
  type: PropertyType;
  subType?: string;
  onChange: (data: { type: PropertyType; subType: string }) => void;
}

const OPTIONS: PropertyTypeOption[] = [
  {
    type: 'HOTEL_ROOM',
    subType: 'Отель',
    title: 'Отель',
    description: 'Номера, спальные места и услуги отеля',
    icon: <Hotel size={24} />,
  },
  {
    type: 'HOTEL_ROOM',
    subType: 'Хостел',
    title: 'Хостел',
    description: 'Бюджетные спальные места в общих номерах',
    icon: <Bed size={24} />,
  },
  {
    type: 'APARTMENT',
    subType: 'Квартира',
    title: 'Квартира',
    description: 'Целые квартиры или отдельные апартаменты',
    icon: <Building2 size={24} />,
  },
  {
    type: 'HOUSE',
    subType: 'Дом',
    title: 'Дом',
    description: 'Коттеджи, виллы и загородные дома',
    icon: <Home size={24} />,
  },
  {
    type: 'PRIVATE_ROOM',
    subType: 'Комната',
    title: 'Комната',
    description: 'Отдельные комнаты в квартире или доме',
    icon: <Bed size={24} />,
  },
];

export const PropertyTypeSelect: React.FC<PropertyTypeSelectProps> = ({ type, subType, onChange }) => {
  // Find current option by both type and subType
  const currentValue = OPTIONS.find(opt => opt.type === type && opt.subType === subType)?.subType || subType;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900">С чего начнем?</h2>
        <p className="mt-2 text-gray-500">Выберите тип объекта недвижимости, который вы хотите сдать.</p>
      </div>
      
      <RadioGroupCard
        value={currentValue}
        onChange={(val) => {
          const option = OPTIONS.find(opt => opt.subType === val);
          if (option) {
            onChange({ type: option.type, subType: option.subType });
          }
        }}
        options={OPTIONS.map(opt => ({
          id: opt.subType,
          title: opt.title,
          description: opt.description,
          icon: opt.icon
        }))}
      />
    </div>
  );
};
