import * as React from 'react';
import { Input } from '../../../../shared/ui/Input/Input';

interface StepProps {
  data: any;
  updateField: (fields: any) => void;
}

export function Step2Details({ data, updateField }: StepProps) {
  const info = data?.details?.apartment_info || {};

  const updateInfo = (fields: any) => {
    updateField({ 
      details: { 
        ...data?.details, 
        apartment_info: { ...info, ...fields } 
      } 
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ padding: '2rem', background: 'white', borderRadius: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>О вашем жилье</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#666' }}>Площадь (м²)</label>
            <Input 
              type="number"
              placeholder="45" 
              value={info.area_sqm || ''}
              onChange={(e) => updateInfo({ area_sqm: Number(e.target.value) })}
              style={{ height: '3.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB', background: '#F9FAFB', padding: '0 1.5rem' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#666' }}>Количество комнат</label>
            <Input 
              type="number"
              placeholder="1" 
              value={info.rooms_count || ''}
              onChange={(e) => updateInfo({ rooms_count: Number(e.target.value) })}
              style={{ height: '3.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB', background: '#F9FAFB', padding: '0 1.5rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#666' }}>Этаж</label>
            <Input 
              type="number"
              placeholder="5" 
              value={info.floor || ''}
              onChange={(e) => updateInfo({ floor: Number(e.target.value) })}
              style={{ height: '3.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB', background: '#F9FAFB', padding: '0 1.5rem' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#666' }}>Всего этажей</label>
            <Input 
              type="number"
              placeholder="9" 
              value={info.total_floors || ''}
              onChange={(e) => updateInfo({ total_floors: Number(e.target.value) })}
              style={{ height: '3.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB', background: '#F9FAFB', padding: '0 1.5rem' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
