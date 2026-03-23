import * as React from 'react';

interface StepProps {
  data: any;
  updateField: (fields: any) => void;
}

const AMENITY_CATEGORIES = [
  {
    title: 'Комфорт',
    items: ['Wi-Fi', 'Кондиционер', 'Кухня', 'Стиральная машина', 'Фен', 'Утюг']
  },
  {
    title: 'Безопасность',
    items: ['Огнетушитель', 'Аптечка', 'Датчик дыма']
  }
];

export function Step3Amenities({ data, updateField }: StepProps) {
  const currentAmenities = data?.amenities || [];

  const toggleAmenity = (item: string) => {
    const newAmenities = currentAmenities.includes(item)
      ? currentAmenities.filter((a: string) => a !== item)
      : [...currentAmenities, item];
    updateField({ amenities: newAmenities });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ padding: '2rem', background: 'white', borderRadius: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Удобства</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {AMENITY_CATEGORIES.map(cat => (
            <div key={cat.title}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', color: '#666' }}>{cat.title}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {cat.items.map(item => (
                  <button
                    key={item}
                    onClick={() => toggleAmenity(item)}
                    style={{
                      padding: '0.75rem 1.5rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '700',
                      background: currentAmenities.includes(item) ? '#2563EB' : '#F3F4F6',
                      color: currentAmenities.includes(item) ? 'white' : '#4B5563',
                      border: 'none', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
