import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  updateDraft, 
  nextStep, 
  selectPropertyDraft 
} from '../../../entities/property/model/draft-slice';
import type { RootState } from '../../../app/store';
import { RadioGroupCard } from '../../../shared/ui/RadioGroupCard/RadioGroupCard';
import { Input } from '../../../shared/ui/Input/Input';
import { Button } from '../../../shared/ui/Button/Button';
import { Card } from '../../../shared/ui/Card/Card';
import { Label } from '../../../shared/ui/Label/Label';
import { 
  Hotel, 
  Building2, 
  Home, 
  DoorOpen, 
  MapPin, 
  ChevronRight 
} from 'lucide-react';

const PROPERTY_TYPES = [
  { 
    id: 'HOTEL_ROOM', 
    title: 'Номер в отеле / хостеле', 
    description: 'Отели, хостелы, базы отдыха',
    icon: <Hotel /> 
  },
  { 
    id: 'APARTMENT', 
    title: 'Квартира / Апартаменты', 
    description: 'Квартиры, студии, апартаменты',
    icon: <Building2 /> 
  },
  { 
    id: 'HOUSE', 
    title: 'Дом / Коттедж', 
    description: 'Дома, коттеджи, таунхаусы',
    icon: <Home /> 
  },
  { 
    id: 'PRIVATE_ROOM', 
    title: 'Комната', 
    description: 'Отдельные комнаты в квартире или доме',
    icon: <DoorOpen /> 
  },
];

const SUB_TYPES: Record<string, string[]> = {
  HOTEL_ROOM: ['Отель', 'Хостел', 'Гостевой дом', 'База отдыха', 'Мини-отель'],
  APARTMENT: ['1-к квартира', '2-к квартира', '3-к квартира', 'Студия', 'Апартаменты'],
  HOUSE: ['Дом', 'Коттедж', 'Дача', 'Таунхаус'],
  PRIVATE_ROOM: ['Комната в квартире', 'Комната в доме'],
};

export const Step1Essentials: React.FC = () => {
  const dispatch = useDispatch();
  const draft = useSelector((state: RootState) => selectPropertyDraft(state));
  
  const handleTypeChange = (type: string) => {
    dispatch(updateDraft({ 
      type: type as any, 
      subType: SUB_TYPES[type]?.[0] || '' 
    }));
  };

  const isNextDisabled = !draft.type || !draft.subType || !draft.city;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Что вы будете сдавать?</h2>
        <RadioGroupCard
          value={draft.type}
          onChange={handleTypeChange}
          options={PROPERTY_TYPES}
          className="lg:grid-cols-2"
        />
      </section>

      {draft.type && (
        <section className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <h3 className="text-lg font-semibold text-gray-800">Уточните тип жилья</h3>
          <div className="flex flex-wrap gap-2">
            {SUB_TYPES[draft.type].map((sub) => (
              <button
                key={sub}
                onClick={() => dispatch(updateDraft({ subType: sub }))}
                className={`px-6 py-3 rounded-full border-2 transition-all font-medium ${
                  draft.subType === sub
                    ? "border-[var(--primary)] bg-[rgba(255,122,0,0.05)] text-[var(--primary)] shadow-sm"
                    : "border-gray-100 bg-white text-gray-600 hover:border-gray-200"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <Label className="text-lg font-semibold text-gray-800">В каком городе находится объект?</Label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors">
            <MapPin size={20} />
          </div>
          <Input
            placeholder="Например, Москва или Сочи"
            value={draft.city}
            onChange={(e) => dispatch(updateDraft({ city: e.target.value }))}
            className="pl-12 py-6 text-lg rounded-2xl border-gray-100 shadow-sm focus:border-[var(--primary)] focus:ring-4 focus:ring-[rgba(255,122,0,0.1)]"
          />
          {/* Simple mock suggestions could go here */}
        </div>
      </section>

      <div className="pt-8 border-t border-gray-50 flex justify-end">
        <Button
          size="lg"
          disabled={isNextDisabled}
          onClick={() => dispatch(nextStep())}
          className="h-14 px-10 rounded-2xl font-bold flex items-center gap-2 group"
          style={{ 
            backgroundColor: isNextDisabled ? 'rgb(243 244 246)' : 'var(--primary)',
            color: isNextDisabled ? 'rgb(156 163 175)' : 'white'
          }}
        >
          Продолжить
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};
