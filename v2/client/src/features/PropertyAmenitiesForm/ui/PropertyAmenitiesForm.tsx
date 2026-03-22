import * as React from "react";
import { Wifi, Car, Utensils, Sparkles, BookOpen, Truck } from "lucide-react";
import { Label } from "../../../shared/ui/Label/Label";
import type { InternetAvailability, ParkingAvailability, AdditionalServicePolicy } from "../../../entities/property/model/types";
import { cn } from "../../../shared/lib/clsx";

interface PropertyAmenitiesFormProps {
  internet?: InternetAvailability;
  parking?: ParkingAvailability;
  isAllInclusive?: boolean;
  cleaningService?: AdditionalServicePolicy;
  bedLinen?: AdditionalServicePolicy;
  hasReportingDocs?: boolean;
  hasTransfer?: boolean;
  onChange: (data: any) => void;
}

const AVAILABILITY_OPTIONS = [
  { value: 'NONE', label: 'Нет' },
  { value: 'FREE', label: 'Бесплатно' },
  { value: 'PAID', label: 'Платно' },
];

const SERVICE_OPTIONS = [
  { value: 'NOT_AVAILABLE', label: 'Нет' },
  { value: 'INCLUDED_IN_PRICE', label: 'Включено' },
  { value: 'AVAILABLE_FOR_FREE', label: 'Бесплатно' },
  { value: 'AVAILABLE_FOR_FEE', label: 'Платно' },
];

export const PropertyAmenitiesForm: React.FC<PropertyAmenitiesFormProps> = ({
  internet = 'NONE',
  parking = 'NONE',
  isAllInclusive = false,
  cleaningService = 'NOT_AVAILABLE',
  bedLinen = 'NOT_AVAILABLE',
  hasReportingDocs = false,
  hasTransfer = false,
  onChange
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Услуги и удобства</h2>
        <p className="mt-2 text-gray-500">Какие услуги вы предоставляете вашим гостям?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Internet */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2"><Wifi size={18} /> Интернет</Label>
          <div className="flex gap-2">
            {AVAILABILITY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ internet: opt.value as InternetAvailability })}
                className={cn(
                  "flex-1 rounded-xl border-2 py-3 text-sm font-bold transition-all",
                  internet === opt.value ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-100"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Parking */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2"><Car size={18} /> Парковка</Label>
          <div className="flex gap-2">
            {AVAILABILITY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ parkingEnum: opt.value as ParkingAvailability })}
                className={cn(
                  "flex-1 rounded-xl border-2 py-3 text-sm font-bold transition-all",
                  parking === opt.value ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-100"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2"><Sparkles size={18} /> Уборка номеров</Label>
          <div className="flex gap-2 flex-wrap">
            {SERVICE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ cleaningService: opt.value as AdditionalServicePolicy })}
                className={cn(
                  "rounded-xl border-2 px-4 py-2 text-xs font-bold transition-all",
                  cleaningService === opt.value ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-100"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="flex items-center gap-2"><BookOpen size={18} /> Отчетные документы</Label>
          <div className="flex gap-2">
            {[true, false].map(v => (
              <button
                key={String(v)}
                type="button"
                onClick={() => onChange({ hasReportingDocs: v })}
                className={cn(
                  "flex-1 rounded-xl border-2 py-3 text-sm font-bold transition-all",
                  hasReportingDocs === v ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-100"
                )}
              >
                {v ? "Да" : "Нет"}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="flex items-center gap-2"><Truck size={18} /> Трансфер</Label>
          <div className="flex gap-2">
            {[true, false].map(v => (
              <button
                key={String(v)}
                type="button"
                onClick={() => onChange({ hasTransfer: v })}
                className={cn(
                  "flex-1 rounded-xl border-2 py-3 text-sm font-bold transition-all",
                  hasTransfer === v ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-100"
                )}
              >
                {v ? "Да" : "Нет"}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <Label className="flex items-center gap-2"><Utensils size={18} /> Всё включено</Label>
          <div className="flex items-center gap-4 py-2">
             <input 
                type="checkbox" 
                checked={isAllInclusive}
                onChange={(e) => onChange({ isAllInclusive: e.target.checked })}
                className="h-6 w-6 rounded-md border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <span className="text-sm text-gray-700">Объект работает по системе All Inclusive</span>
          </div>
        </div>
      </div>
    </div>
  );
};
