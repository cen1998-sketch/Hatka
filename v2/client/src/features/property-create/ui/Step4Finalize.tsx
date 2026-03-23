import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectPropertyDraft, 
  updateDraft, 
  resetDraft 
} from '../../../entities/property/model/draft-slice';
import type { RootState } from '../../../app/store';
import { api } from '../../../shared/api/api-base.ts';
import { Button } from '../../../shared/ui/Button/Button';
import { Card } from '../../../shared/ui/Card/Card';
import { CheckCircle2, Rocket, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';

export const Step4Finalize: React.FC = () => {
  const draft = useSelector((state: RootState) => selectPropertyDraft(state));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handlePublish = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await api.post('/properties', {
        ...draft,
        hotelRooms: draft.type === 'HOTEL_ROOM' ? draft.rooms : []
      });
      
      if (response.data.success) {
        dispatch(resetDraft());
        // Show success state or redirect
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка при сохранении. Попробуйте еще раз.');
      setIsSubmitting(false);
    }
  };

  const isSuccess = !isSubmitting && !error && !draft.isSubmitting; // Just a mock for now

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-10 animate-in fade-in zoom-in-95 duration-700">
      <div className="relative">
        <div className="absolute inset-0 bg-[var(--primary)] opacity-20 blur-3xl rounded-full scale-150 animate-pulse" />
        <div className="relative h-32 w-32 rounded-full bg-white border-4 border-[var(--primary)] flex items-center justify-center text-[var(--primary)] shadow-2xl">
          <Rocket size={60} className="animate-bounce" />
        </div>
      </div>

      <div className="text-center space-y-3">
        <h2 className="text-3xl font-black text-gray-900">Почти готово!</h2>
        <p className="text-gray-500 max-w-md mx-auto font-medium">
          Мы проверили ваше объявление. Оно выглядит отлично и готово к отправке на модерацию.
        </p>
      </div>

      <Card className="w-full p-8 rounded-[2rem] border-0 bg-blue-50/50 space-y-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-blue-500 shadow-sm">
            <Sparkles size={24} />
          </div>
          <div>
            <h4 className="font-bold text-blue-900">{draft.title}</h4>
            <p className="text-sm text-blue-700">{draft.subType} • {draft.city}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-wider text-blue-800 opacity-70">
          <p>Фотографий: {draft.images.length}</p>
          {draft.type === 'HOTEL_ROOM' && <p>Категорий номеров: {draft.rooms.length}</p>}
        </div>
      </Card>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 animate-in shake duration-300">
          <AlertCircle size={20} />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-4 w-full pt-6">
        <Button
          onClick={handlePublish}
          disabled={isSubmitting}
          className="h-16 text-xl font-black rounded-2xl bg-[var(--primary)] text-white shadow-2xl shadow-[rgba(255,122,0,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" />
              Отправляем...
            </>
          ) : (
            'Опубликовать объявление'
          )}
        </Button>
        <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          После нажатия объект будет отправлен на модерацию
        </p>
      </div>
    </div>
  );
};
