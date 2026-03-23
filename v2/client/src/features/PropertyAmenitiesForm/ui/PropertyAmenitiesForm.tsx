import * as React from "react";
import { Label } from "../../../shared/ui/Label/Label";
import { Switch } from "../../../shared/ui/Switch/Switch";
import { cn } from "../../../shared/lib/clsx";

interface PropertyAmenitiesFormProps {
  internet?: string;
  parking?: string;
  amenities?: string[];
  isAllInclusive?: boolean;
  cleaningService?: string;
  bedLinen?: string;
  hasReportingDocs?: boolean;
  hasTransfer?: boolean;
  mode?: 'internetOnly' | 'parkingOnly' | 'amenitiesGrid' | 'nutrition' | 'extraServices';
  onChange: (data: any) => void;
}

const AMENITIES_CATEGORIES = [
  {
    title: "Питание",
    items: ["Ресторан", "Барная стойка", "Доставка в номер", "Детское меню"]
  },
  {
    title: "Спорт",
    items: ["Фитнес-зал", "Футбольное поле", "Гольф", "Теннисный корт"]
  },
  {
    title: "Спа",
    items: ["Сауна", "Спа-центр", "Крытый бассейн", "Бассейн с подогревом", "Открытый бассейн", "Джакузи", "Банный чан"]
  },
  {
    title: "Удобства",
    items: ["Лифт", "Прачечная", "Круглосуточная стойка регистрации", "Пандус", "Камера хранения"]
  }
];

export const PropertyAmenitiesForm: React.FC<PropertyAmenitiesFormProps> = ({
  internet = 'NONE',
  parking = 'NONE',
  amenities = [],
  isAllInclusive = false,
  cleaningService = 'NOT_AVAILABLE',
  bedLinen = 'NOT_AVAILABLE',
  hasReportingDocs = false,
  hasTransfer = false,
  mode = 'amenitiesGrid',
  onChange
}) => {
  const toggleAmenity = (name: string) => {
    const next = amenities.includes(name)
      ? amenities.filter(a => a !== name)
      : [...amenities, name];
    onChange({ amenities: next });
  };

  const RadioSelector = ({ value, field, options }: any) => (
    <div className="space-y-4">
      {options.map(opt => (
        <label key={opt.id} className="flex items-center gap-4 cursor-pointer group">
          <div className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
            value === opt.id ? "border-[var(--primary)]" : "border-[var(--border)] bg-[var(--background)]"
          )}>
            {value === opt.id && <div className="w-3.5 h-3.5 rounded-full bg-[var(--primary)]" />}
          </div>
          <input 
            type="radio" 
            className="hidden" 
            checked={value === opt.id}
            onChange={() => onChange({ [field]: opt.id })}
          />
          <span className="text-sm text-[var(--foreground)] font-medium group-hover:text-[var(--primary)] transition-colors">{opt.label}</span>
        </label>
      ))}
    </div>
  );

  if (mode === 'internetOnly' || mode === 'parkingOnly') {
    const value = mode === 'internetOnly' ? internet : parking;
    const field = mode === 'internetOnly' ? 'internet' : 'parking';
    const msg = mode === 'internetOnly' ? "Услуга, на которую чаще всего обращают внимание гости при поиске жилья" : "";
    
    const options = [
      { id: 'PAID', label: mode === 'internetOnly' ? 'Да, платно' : 'Платная' },
      { id: 'FREE', label: mode === 'internetOnly' ? 'Да, бесплатно' : 'Бесплатная' },
      { id: 'NONE', label: 'Нет' }
    ];

    return (
      <div className="space-y-6">
        {msg && <p className="text-sm text-[var(--muted-foreground)] leading-relaxed italic">{msg}</p>}
        <RadioSelector value={value} field={field} options={options} />
      </div>
    );
  }

  if (mode === 'amenitiesGrid') {
    return (
      <div className="space-y-10">
        {AMENITIES_CATEGORIES.map(cat => (
          <div key={cat.title} className="space-y-4">
            <h4 className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest">{cat.title}</h4>
            <div className="flex flex-wrap gap-3">
              {cat.items.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleAmenity(item)}
                  className={cn(
                    "px-5 py-2.5 text-sm font-medium rounded-full border transition-all",
                    amenities.includes(item)
                      ? "bg-white border-[var(--primary)] text-[var(--foreground)] shadow-sm"
                      : "bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] hover:border-[var(--muted)]"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (mode === 'nutrition') {
    return (
      <div className="space-y-8">
        <p className="text-sm text-[var(--muted-foreground)] italic">Информация о питании появится во всех категориях номеров</p>
        
        <label className="flex items-start gap-4 cursor-pointer group">
          <div className={cn(
            "mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
            isAllInclusive ? "border-[var(--primary)]" : "border-[var(--border)] bg-[var(--background)]"
          )}>
            {isAllInclusive && <div className="w-3.5 h-3.5 rounded-full bg-[var(--primary)]" />}
          </div>
          <div className="flex-1">
            <span className="text-sm text-[var(--foreground)] font-bold block">Всё включено</span>
            <span className="text-xs text-[var(--muted-foreground)]">В стоимость проживания включены завтрак, обед и ужин</span>
          </div>
          <input 
            type="radio" 
            className="hidden" 
            checked={isAllInclusive}
            onChange={() => onChange({ isAllInclusive: true })}
          />
        </label>

        <label className="flex items-center gap-4 cursor-pointer group">
          <div className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
            !isAllInclusive ? "border-[var(--primary)]" : "border-[var(--border)] bg-[var(--background)]"
          )}>
            {!isAllInclusive && <div className="w-3.5 h-3.5 rounded-full bg-[var(--primary)]" />}
          </div>
          <span className="text-sm text-[var(--foreground)] font-bold">Настроить вручную</span>
          <input 
            type="radio" 
            className="hidden" 
            checked={!isAllInclusive}
            onChange={() => onChange({ isAllInclusive: false })}
          />
        </label>

        {!isAllInclusive && (
          <div className="space-y-5 pt-4 pl-10 border-l border-[var(--border)] ml-3">
            {['Завтрак', 'Обед', 'Ужин'].map(meal => (
              <div key={meal} className="grid grid-cols-[120px,1fr] items-center gap-6">
                <span className="text-sm text-[var(--muted-foreground)] font-medium">{meal}</span>
                <select className="h-11 px-4 bg-[var(--background)] border border-[var(--border)] rounded-[var(--radius)] text-sm outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all">
                  <option>Выберите</option>
                  <option>Буфет</option>
                  <option>По меню</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (mode === 'extraServices') {
    return (
      <div className="space-y-12">
        <p className="text-sm text-[var(--muted-foreground)] italic leading-relaxed">
          Это дополнительные услуги, их можно предоставить только по запросу гостя или с его согласия. 
          Стоимость этих услуг не включается в расчёт общей цены при бронировании...
        </p>

        <div className="space-y-6">
          <h4 className="text-lg font-bold text-[var(--foreground)]">Уборка</h4>
          <RadioSelector 
            value={cleaningService} 
            field="cleaningService" 
            options={[
              { id: 'INCLUDED', label: 'Входит в стоимость проживания' },
              { id: 'NONE', label: 'Нет' },
              { id: 'FREE', label: 'Да, бесплатно' },
              { id: 'PAID', label: 'Да, платно' }
            ]} 
          />
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-bold text-[var(--foreground)]">Постельное белье</h4>
          <RadioSelector 
            value={bedLinen} 
            field="bedLinen" 
            options={[
              { id: 'INCLUDED', label: 'Входит в стоимость проживания' },
              { id: 'NONE', label: 'Нет' },
              { id: 'FREE', label: 'Да, бесплатно' },
              { id: 'PAID', label: 'Да, платно' }
            ]} 
          />
        </div>

        <div className="pt-8 border-t border-[var(--border)] space-y-6">
          <div className="flex items-center justify-between group cursor-pointer" onClick={() => onChange({ hasReportingDocs: !hasReportingDocs })}>
            <Label className="text-sm text-[var(--foreground)] font-medium cursor-pointer">Отчётные документы</Label>
            <Switch checked={hasReportingDocs} />
          </div>
          <div className="flex items-center justify-between group cursor-pointer" onClick={() => onChange({ hasTransfer: !hasTransfer })}>
            <Label className="text-sm text-[var(--foreground)] font-medium cursor-pointer">Предоставляется трансфер</Label>
            <Switch checked={hasTransfer} />
          </div>
        </div>
      </div>
    );
  }

  return null;
};
