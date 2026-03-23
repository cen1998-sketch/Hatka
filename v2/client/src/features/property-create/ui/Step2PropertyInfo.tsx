import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDraft, nextStep, selectPropertyDraft } from '../../../entities/property/model/draft-slice';
import type { RootState } from '../../../app/store';
import { Input } from '../../../shared/ui/Input/Input';
import { Button } from '../../../shared/ui/Button/Button';
import { Card } from '../../../shared/ui/Card/Card';
import { Label } from '../../../shared/ui/Label/Label';
import { PropertyPhotosForm } from '../../../features/PropertyPhotosForm/ui/PropertyPhotosForm';
import { Checkbox } from '../../../shared/ui/Checkbox/Checkbox';
import { Star, Info, Camera, MapPin, FileEdit } from 'lucide-react';

const AMENITIES = [
  { id: 'wifi', name: 'Бесплатный Wi-Fi', icon: '📶' },
  { id: 'parking', name: 'Парковка', icon: '🚗' },
  { id: 'pool', name: 'Бассейн', icon: '🏊' },
  { id: 'gym', name: 'Тренажерный зал', icon: '🏋️' },
  { id: 'spa', name: 'СПА-центр', icon: '🧖' },
  { id: 'restaurant', name: 'Ресторан', icon: '🍴' },
  { id: 'ac', name: 'Кондиционер', icon: '❄️' },
];

export const Step2PropertyInfo: React.FC = () => {
  const dispatch = useDispatch();
  const draft = useSelector((state: RootState) => selectPropertyDraft(state));
  
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (draft.title.length < 10) newErrors.title = 'Минимум 10 символов';
    if (draft.description.length < 50) newErrors.description = 'Минимум 50 символов';
    if (!draft.address) newErrors.address = 'Укажите точный адрес';
    if (draft.images.length < 3) newErrors.images = 'Загрузите минимум 3 фото';
    
    if (draft.type === 'HOTEL_ROOM') {
      if (!draft.registryNumber) newErrors.registryNumber = 'Обязательно для отелей';
      if (draft.starRating === 0) newErrors.starRating = 'Укажите количество звезд';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      dispatch(nextStep());
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[rgba(255,122,0,0.1)] text-[var(--primary)] flex items-center justify-center">
            <FileEdit size={20} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Основная информация</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700 ml-1">Название объекта</Label>
            <Input
              placeholder="Напр., Отель 'Уютный берег' или Студия в центре"
              value={draft.title}
              onChange={(e) => dispatch(updateDraft({ title: e.target.value }))}
              className={`py-4 rounded-xl border-gray-100 ${errors.title ? 'border-red-400 ring-4 ring-red-50' : ''}`}
            />
            {errors.title && <p className="text-xs font-bold text-red-500 ml-1">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700 ml-1">Описание</Label>
            <textarea
              placeholder="Расскажите гостям об особенностях вашего жилья..."
              value={draft.description}
              onChange={(e) => dispatch(updateDraft({ description: e.target.value }))}
              className={`w-full min-h-[150px] p-4 rounded-xl border-2 border-gray-100 transition-all focus:border-[var(--primary)] outline-none resize-none ${
                errors.description ? 'border-red-400 ring-4 ring-red-50' : 'hover:border-gray-200'
              }`}
            />
            <div className="flex justify-between items-center px-1">
              {errors.description && <p className="text-xs font-bold text-red-500">{errors.description}</p>}
              <p className={`text-[10px] font-bold uppercase tracking-widest ${draft.description.length < 50 ? 'text-gray-400' : 'text-green-500'}`}>
                {draft.description.length} / 50 символов
              </p>
            </div>
          </div>
        </div>
      </section>

      {draft.type === 'HOTEL_ROOM' && (
        <section className="p-8 rounded-3xl bg-blue-50/50 border border-blue-100 space-y-6 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-2 text-blue-800">
            <Info size={18} />
            <h3 className="font-bold">Информация для реестра</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">Номер в реестре</Label>
              <Input
                placeholder="123-456-789"
                value={draft.registryNumber}
                onChange={(e) => dispatch(updateDraft({ registryNumber: e.target.value }))}
                className="bg-white border-blue-100"
              />
              {errors.registryNumber && <p className="text-xs font-bold text-red-500">{errors.registryNumber}</p>}
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-bold text-gray-700">Звездность</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => dispatch(updateDraft({ starRating: star }))}
                    className={`h-12 flex-1 rounded-xl flex items-center justify-center transition-all border-2 ${
                      draft.starRating >= star
                        ? 'bg-white border-yellow-400 text-yellow-400 shadow-sm'
                        : 'bg-white border-gray-100 text-gray-200'
                    }`}
                  >
                    <Star size={20} fill={draft.starRating >= star ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
              {errors.starRating && <p className="text-xs font-bold text-red-500">{errors.starRating}</p>}
            </div>
          </div>
        </section>
      )}

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[rgba(255,122,0,0.1)] text-[var(--primary)] flex items-center justify-center">
            <MapPin size={20} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Адрес</h2>
        </div>
        <div className="space-y-2">
          <Input
            placeholder="Улица, дом, корпус..."
            value={draft.address}
            onChange={(e) => dispatch(updateDraft({ address: e.target.value }))}
            className={`py-6 rounded-xl border-gray-100 text-lg ${errors.address ? 'border-red-400 shadow-[0_0_0_4px_rgba(240,68,68,0.1)]' : ''}`}
          />
          {errors.address && <p className="text-xs font-bold text-red-500 ml-1">{errors.address}</p>}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[rgba(255,122,0,0.1)] text-[var(--primary)] flex items-center justify-center">
            <Camera size={20} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Фотографии</h2>
        </div>
        <PropertyPhotosForm
          images={draft.images}
          onChange={(data) => dispatch(updateDraft({ images: data.images }))}
        />
        {errors.images && <p className="text-sm font-bold text-red-500 animate-bounce">{errors.images}</p>}
      </section>

      <div className="pt-12 border-t border-gray-100 flex justify-end gap-4">
        <Button
          variant="outline"
          size="lg"
          className="h-14 px-10 rounded-2xl font-bold"
        >
          Сохранить черновик
        </Button>
        <Button
          size="lg"
          onClick={handleNext}
          className="h-14 px-10 rounded-2xl font-bold bg-[var(--primary)] text-white shadow-xl shadow-[rgba(255,122,0,0.2)] hover:scale-105 transition-transform"
        >
          Далее
        </Button>
      </div>
    </div>
  );
};
