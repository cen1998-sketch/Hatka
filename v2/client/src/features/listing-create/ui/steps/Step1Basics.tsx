import * as React from 'react';
import { Input } from '../../../../shared/ui/Input/Input';

interface StepProps {
  data: any;
  updateField: (fields: any) => void;
}

export function Step1Location({ data, updateField }: StepProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ padding: '2rem', background: 'white', borderRadius: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Где находится ваше жильё?</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#666' }}>Регион / Область</label>
            <Input 
              placeholder="Например: Томская область" 
              value={data?.details?.region || ''}
              onChange={(e) => updateField({ details: { ...data?.details, region: e.target.value } })}
              style={{ height: '3.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB', background: '#F9FAFB', padding: '0 1.5rem' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#666' }}>Город</label>
            <Input 
              placeholder="Томск" 
              value={data?.city || ''}
              onChange={(e) => updateField({ city: e.target.value })}
              style={{ height: '3.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB', background: '#F9FAFB', padding: '0 1.5rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#666' }}>Улица</label>
          <Input 
            placeholder="Никитина" 
            value={data?.streetName || ''}
            onChange={(e) => updateField({ streetName: e.target.value })}
            style={{ height: '3.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB', background: '#F9FAFB', padding: '0 1.5rem' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#666' }}>Номер дома</label>
            <Input 
              placeholder="42" 
              value={data?.houseNumber || ''}
              onChange={(e) => updateField({ houseNumber: e.target.value })}
              style={{ height: '3.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB', background: '#F9FAFB', padding: '0 1.5rem' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#666' }}>Корпус / Строение</label>
            <Input 
              placeholder="Б" 
              value={data?.details?.building || ''}
              onChange={(e) => updateField({ details: { ...data?.details, building: e.target.value } })}
              style={{ height: '3.5rem', borderRadius: '1rem', border: '1px solid #E5E7EB', background: '#F9FAFB', padding: '0 1.5rem' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
