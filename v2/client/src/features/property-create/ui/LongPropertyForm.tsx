import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  updateDraft, 
  selectPropertyDraft, 
  resetDraft,
  addRoom,
  updateRoom,
  removeRoom
} from '../../../entities/property/model/draft-slice';
import type { RootState } from '../../../app/store';
import { Input } from '../../../shared/ui/Input/Input';
import { Button } from '../../../shared/ui/Button/Button';
import { Card } from '../../../shared/ui/Card/Card';
import { Label } from '../../../shared/ui/Label/Label';
import { PropertyPhotosForm } from '../../../features/PropertyPhotosForm/ui/PropertyPhotosForm';
import { Checkbox } from '../../../shared/ui/Checkbox/Checkbox';
import { 
  Wifi, 
  ParkingCircle, 
  Utensils, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Camera, 
  MapPin, 
  Building2, 
  Star,
  Plus,
  Trash2,
  Users,
  Bed,
  Maximize,
  ChevronRight,
  Info
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AMENITY_CATEGORIES = [
  {
    title: 'Питание',
    items: ['Чай/кофе', 'Кухня в номере', 'Электрочайник', 'Мини-бар']
  },
  {
    title: 'Спорт',
    items: ['Тренажерный зал', 'Настольный теннис', 'Бильярд', 'Теннисный корт']
  },
  {
    title: 'Спа',
    items: ['Баня', 'Сауна', 'Хаммам', 'Массаж', 'Бассейн']
  }
];

export const LongPropertyForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  
  const draft = useSelector((state: RootState) => selectPropertyDraft(state));
  const { type, rules, hasWifi, hasParking, meals, amenityIds, rooms } = draft;

  // Initialize type if provided in URL
  React.useEffect(() => {
    if (typeParam === 'Гостиница' && type !== 'HOTEL_ROOM') {
      dispatch(updateDraft({ type: 'HOTEL_ROOM' }));
    }
  }, [typeParam, dispatch, type]);

  const handleUpdate = (data: any) => dispatch(updateDraft(data));

  const toggleAmenity = (id: string) => {
    const newIds = amenityIds.includes(id)
      ? amenityIds.filter(i => i !== id)
      : [...amenityIds, id];
    handleUpdate({ amenityIds: newIds });
  };

  const handleRuleToggle = (key: keyof typeof rules) => {
    handleUpdate({
      rules: { ...rules, [key]: !rules[key] }
    });
  };

  const isHotel = type === 'HOTEL_ROOM';

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-10 animate-in fade-in duration-1000">
      {/* Header Section */}
      <section className="space-y-2">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Создание объекта</h1>
        <p className="text-lg text-gray-500 font-medium">Заполните данные максимально подробно для прохождения модерации</p>
      </section>

      {/* 1. Название и адрес */}
      <Card className="p-8 space-y-8 rounded-[2rem] border-0 shadow-xl shadow-gray-200/50 bg-white">
        <div className="flex items-center gap-3 text-[var(--primary)]">
          <MapPin size={24} strokeWidth={2.5} />
          <h2 className="text-xl font-black uppercase tracking-wider">Название и адрес</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Название объекта</Label>
            <Input 
              value={draft.title}
              onChange={(val) => handleUpdate({ title: val })}
              placeholder="Например: Отель 'Звездный' или Уютная квартира в центре"
              className="h-16 text-lg font-bold rounded-2xl bg-gray-50 border-0 focus:ring-2 focus:ring-[var(--primary-glow)]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Город</Label>
              <Input 
                value={draft.city}
                onChange={(val) => handleUpdate({ city: val })}
                placeholder="Москва"
                className="h-14 rounded-xl bg-gray-50 border-0"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Улица</Label>
              <Input 
                value={draft.streetName}
                onChange={(val) => handleUpdate({ streetName: val })}
                placeholder="Тверская"
                className="h-14 rounded-xl bg-gray-50 border-0"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Интернет и Парковка */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-8 space-y-6 rounded-[2rem] border-0 shadow-xl shadow-gray-200/50 bg-white">
          <div className="flex items-center gap-3 text-blue-500">
            <Wifi size={24} strokeWidth={2.5} />
            <h2 className="text-lg font-black uppercase tracking-wider">Интернет</h2>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { id: 'free', label: 'Бесплатный Wi-Fi' },
              { id: 'paid', label: 'Платный Wi-Fi' },
              { id: 'none', label: 'Нет' }
            ].map(opt => (
              <button 
                key={opt.id}
                onClick={() => handleUpdate({ hasWifi: opt.id })}
                className={`h-14 rounded-2xl px-6 flex items-center justify-between font-bold transition-all ${
                  hasWifi === opt.id 
                    ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-100 shadow-sm' 
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
              >
                {opt.label}
                {hasWifi === opt.id && <ShieldCheck size={20} />}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-8 space-y-6 rounded-[2rem] border-0 shadow-xl shadow-gray-200/50 bg-white">
          <div className="flex items-center gap-3 text-emerald-500">
            <ParkingCircle size={24} strokeWidth={2.5} />
            <h2 className="text-lg font-black uppercase tracking-wider">Парковка</h2>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { id: 'free', label: 'Бесплатная' },
              { id: 'paid', label: 'Платная' },
              { id: 'none', label: 'Нет' }
            ].map(opt => (
              <button 
                key={opt.id}
                onClick={() => handleUpdate({ hasParking: opt.id })}
                className={`h-14 rounded-2xl px-6 flex items-center justify-between font-bold transition-all ${
                  hasParking === opt.id 
                    ? 'bg-emerald-50 text-emerald-600 ring-2 ring-emerald-100 shadow-sm' 
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
              >
                {opt.label}
                {hasParking === opt.id && <ShieldCheck size={20} />}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* 3. Питание */}
      <Card className="p-8 space-y-6 rounded-[2rem] border-0 shadow-xl shadow-gray-200/50 bg-white">
        <div className="flex items-center gap-3 text-orange-500">
          <Utensils size={24} strokeWidth={2.5} />
          <h2 className="text-xl font-black uppercase tracking-wider">Питание</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { id: 'none', label: 'Без питания' },
            { id: 'breakfast', label: 'Завтрак' },
            { id: 'half_board', label: 'Полупансион' },
            { id: 'full_board', label: 'Полный пансион' },
            { id: 'all_inclusive', label: 'Все включено' }
          ].map(opt => (
            <button 
              key={opt.id}
              onClick={() => handleUpdate({ meals: opt.id })}
              className={`h-16 rounded-2xl p-2 flex flex-col items-center justify-center text-center text-xs font-black transition-all ${
                meals === opt.id 
                  ? 'bg-orange-50 text-orange-600 ring-2 ring-orange-100 shadow-sm' 
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Card>

      {/* 4. Удобства и услуги */}
      <Card className="p-8 space-y-8 rounded-[2rem] border-0 shadow-xl shadow-gray-200/50 bg-white">
        <div className="flex items-center gap-3 text-purple-500">
          <Sparkles size={24} strokeWidth={2.5} />
          <h2 className="text-xl font-black uppercase tracking-wider">Удобства и услуги</h2>
        </div>

        <div className="space-y-8">
          {AMENITY_CATEGORIES.map(cat => (
            <div key={cat.title} className="space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{cat.title}</h4>
              <div className="flex flex-wrap gap-2">
                {cat.items.map(item => (
                  <button
                    key={item}
                    onClick={() => toggleAmenity(item)}
                    className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
                      amenityIds.includes(item)
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-200'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 5. Правила проживания */}
      <Card className="p-8 space-y-8 rounded-[2rem] border-0 shadow-xl shadow-gray-200/50 bg-white">
        <div className="flex items-center gap-3 text-rose-500">
          <ShieldCheck size={24} strokeWidth={2.5} />
          <h2 className="text-xl font-black uppercase tracking-wider">Правила проживания</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'smoking', label: 'Можно курить', icon: '🚬' },
            { key: 'parties', label: 'Вечеринки', icon: '🎉' },
            { key: 'pets', label: 'С питомцами', icon: '🐾' },
            { key: 'children', label: 'С детьми', icon: '👶' }
          ].map(rule => (
            <button
              key={rule.key}
              //@ts-ignore
              onClick={() => handleRuleToggle(rule.key)}
              className={`h-16 rounded-2xl px-6 flex items-center justify-between font-bold transition-all ${
                //@ts-ignore
                rules[rule.key]
                  ? 'bg-rose-50 text-rose-600 ring-2 ring-rose-100 shadow-sm'
                  : 'bg-gray-50 text-gray-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{rule.icon}</span>
                {rule.label}
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-colors ${
                //@ts-ignore
                rules[rule.key] ? 'bg-rose-500' : 'bg-gray-200'
              }`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                   //@ts-ignore
                   rules[rule.key] ? 'left-7' : 'left-1'
                }`} />
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* 6. Описание */}
      <Card className="p-8 space-y-6 rounded-[2rem] border-0 shadow-xl shadow-gray-200/50 bg-white">
        <div className="flex items-center gap-3 text-slate-500">
          <FileText size={24} strokeWidth={2.5} />
          <h2 className="text-xl font-black uppercase tracking-wider">Описание</h2>
        </div>
        <textarea
          value={draft.description}
          onChange={(e) => handleUpdate({ description: e.target.value })}
          placeholder="Расскажите подробнее о вашем объекте, особенностях и преимуществах..."
          className="w-full min-h-[200px] p-6 rounded-2xl bg-gray-50 border-0 focus:ring-2 focus:ring-slate-100 font-medium text-gray-700 resize-none"
        />
      </Card>

      {/* 7. Фотографии */}
      <Card className="p-8 space-y-8 rounded-[2rem] border-0 shadow-xl shadow-gray-200/50 bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-50" />
        <div className="flex items-center gap-3 text-yellow-500 relative z-10">
          <Camera size={24} strokeWidth={2.5} />
          <h2 className="text-xl font-black uppercase tracking-wider">Фотографии объекта</h2>
        </div>
        <PropertyPhotosForm 
          images={draft.images}
          onChange={(imgs) => handleUpdate({ images: imgs })}
        />
      </Card>

      {/* Final Action Bar */}
      <div className="sticky bottom-8 z-50 animate-in slide-in-from-bottom-10 duration-700 delay-300">
        <Card className="p-4 rounded-3xl bg-white/80 backdrop-blur-xl border border-gray-100 shadow-2xl flex items-center justify-between gap-6">
          <div className="px-4">
             <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Статус заполнения</div>
             <div className="flex gap-1 mt-1">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className={`h-1.5 w-6 rounded-full ${i <= 3 ? 'bg-[var(--primary)]' : 'bg-gray-100'}`} />
                ))}
             </div>
          </div>
          <Button 
             onClick={() => navigate('/host/publish')}
             className="h-14 px-10 text-lg font-black rounded-2xl bg-[var(--primary)] text-white shadow-xl shadow-[rgba(255,122,0,0.3)] hover:scale-[1.02] transition-all"
          >
            Продолжить
          </Button>
        </Card>
      </div>
    </div>
  );
};
