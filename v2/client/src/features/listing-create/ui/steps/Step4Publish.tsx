import * as React from 'react';
import { Input } from '../../../../shared/ui/Input/Input';
import { Loader2 } from 'lucide-react';

interface StepProps {
  data: any;
  updateField: (fields: any) => void;
  onPublish: () => void;
  isPublishing: boolean;
}

export function Step4Publish({ data, updateField, onPublish, isPublishing }: StepProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ padding: '2rem', background: 'white', borderRadius: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Цена за сутки</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#666' }}>Стоимость в рублях</label>
          <div style={{ position: 'relative' }}>
            <Input 
              type="number"
              placeholder="3000" 
              value={data?.pricePerDay || ''}
              onChange={(e) => updateField({ pricePerDay: Number(e.target.value) })}
              style={{ height: '3.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB', background: '#F9FAFB', padding: '0 3.5rem 0 1.5rem' }}
            />
            <span style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', fontWeight: '800', color: '#999' }}>₽</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '2rem', background: '#EFF6FF', borderRadius: '1.5rem', border: '1px solid #DBEAFE' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E40AF', marginBottom: '1rem' }}>Почти готово!</h3>
        <p style={{ color: '#1E40AF', opacity: 0.8, marginBottom: '2rem' }}>
          После публикации ваше объявление уйдет на проверку модератору. Обычно это занимает от 30 минут до 2 часов.
        </p>
        <button 
          onClick={onPublish}
          disabled={isPublishing}
          style={{
            width: '100%', height: '4rem', background: '#2563EB', color: 'white', borderRadius: '1.25rem',
            fontSize: '1.125rem', fontWeight: '800', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem'
          }}
        >
          {isPublishing ? <Loader2 className="animate-spin" /> : 'Опубликовать объявление'}
        </button>
      </div>
    </div>
  );
}
