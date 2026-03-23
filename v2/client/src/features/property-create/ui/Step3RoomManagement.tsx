import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addRoom, 
  updateRoom, 
  removeRoom, 
  selectPropertyDraft,
  nextStep,
  updateDraft
} from '../../../entities/property/model/draft-slice';
import type { RootState } from '../../../app/store';
import { Button } from '../../../shared/ui/Button/Button';
import { Input } from '../../../shared/ui/Input/Input';
import { Card } from '../../../shared/ui/Card/Card';
import { Label } from '../../../shared/ui/Label/Label';
import { PropertyPhotosForm } from '../../../features/PropertyPhotosForm/ui/PropertyPhotosForm';
import { Plus, Trash2, Bed, Users, Maximize, CreditCard, ChevronRight, Hotel } from 'lucide-react';

export const Step3RoomManagement: React.FC = () => {
  const dispatch = useDispatch();
  const { rooms } = useSelector((state: RootState) => selectPropertyDraft(state));
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleAddRoom = () => {
    dispatch(addRoom({
      id: crypto.randomUUID(),
      title: 'Стандартный номер',
      description: '',
      price: 0,
      capacity: 2,
      beds: 1,
      size: 20,
      images: []
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (rooms.length === 0) {
      alert('Добавьте хотя бы одну категорию номера');
      return false;
    }
    
    rooms.forEach(room => {
      if (room.images.length === 0) {
        newErrors[`${room.id}-images`] = 'Загрузите минимум 1 фото номера';
      }
      if (room.price <= 0) {
        newErrors[`${room.id}-price`] = 'Укажите цену';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFinish = () => {
    if (validate()) {
      dispatch(nextStep());
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[rgba(255,122,0,0.1)] text-[var(--primary)] flex items-center justify-center">
            <Hotel size={20} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Категории номеров</h2>
        </div>
        <Button 
          onClick={handleAddRoom}
          className="rounded-full bg-[var(--primary)] text-white gap-2 font-bold px-6 shadow-lg shadow-[rgba(255,122,0,0.2)]"
        >
          <Plus size={18} />
          Добавить категорию
        </Button>
      </header>

      {rooms.length === 0 ? (
        <Card className="p-16 border-dashed bg-gray-50/30 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-20 h-20 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-300 shadow-sm">
            <Bed size={32} />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-700">У вас пока нет номеров</p>
            <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1">Добавьте типы номеров, которые есть в вашем объекте (например: Стандарт, Люкс, Хостел-место)</p>
          </div>
          <Button variant="outline" onClick={handleAddRoom} className="mt-4 rounded-xl border-gray-200 font-bold px-8">
            Начать добавление
          </Button>
        </Card>
      ) : (
        <div className="space-y-8">
          {rooms.map((room, index) => (
            <Card key={room.id} className="p-8 rounded-[2rem] border-0 shadow-xl shadow-gray-200/40 bg-white group relative">
              <button 
                onClick={() => dispatch(removeRoom(room.id))}
                className="absolute top-6 right-6 h-10 w-10 rounded-xl bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={18} />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left side: Basic Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-8 w-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <Input 
                      placeholder="Название категории (напр. Стандарт)"
                      value={room.title}
                      onChange={(e) => dispatch(updateRoom({ id: room.id, data: { title: e.target.value } }))}
                      className="text-xl font-bold border-0 border-b-2 border-gray-100 rounded-none focus:border-[var(--primary)] px-0"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
                        <CreditCard size={12} /> Цена за ночь
                      </Label>
                      <Input 
                        type="number"
                        value={room.price}
                        onChange={(e) => dispatch(updateRoom({ id: room.id, data: { price: Number(e.target.value) } }))}
                        className={`font-bold transition-all ${errors[`${room.id}-price`] ? 'border-red-400 ring-2 ring-red-50' : ''}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
                        <Users size={12} /> Вместимость
                      </Label>
                      <Input 
                        type="number"
                        value={room.capacity}
                        onChange={(e) => dispatch(updateRoom({ id: room.id, data: { capacity: Number(e.target.value) } }))}
                        className="font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
                        <Bed size={12} /> Кровати
                      </Label>
                      <Input 
                        type="number"
                        value={room.beds}
                        onChange={(e) => dispatch(updateRoom({ id: room.id, data: { beds: Number(e.target.value) } }))}
                        className="font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
                        <Maximize size={12} /> Площадь (м²)
                      </Label>
                      <Input 
                        type="number"
                        value={room.size}
                        onChange={(e) => dispatch(updateRoom({ id: room.id, data: { size: Number(e.target.value) } }))}
                        className="font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Right side: Photos */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      Фотографии номера
                    </Label>
                    {errors[`${room.id}-images`] && (
                      <span className="text-[10px] font-bold text-red-500 uppercase">{errors[`${room.id}-images`]}</span>
                    )}
                  </div>
                  <PropertyPhotosForm 
                    images={room.images}
                    onChange={(data) => dispatch(updateRoom({ id: room.id, data: { images: data.images } }))}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

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
          onClick={handleFinish}
          className="h-14 px-10 rounded-2xl font-bold bg-[var(--primary)] text-white shadow-xl shadow-[rgba(255,122,0,0.2)] flex items-center gap-2 group"
        >
          Продолжить
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};
