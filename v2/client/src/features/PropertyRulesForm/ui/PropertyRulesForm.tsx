import * as React from "react";
import { Clock, Ban, CreditCard } from "lucide-react";
import { Input } from "../../../shared/ui/Input/Input";
import { Label } from "../../../shared/ui/Label/Label";
import type { SmokingPolicy, PaymentMethodType } from "../../../entities/property/model/types";
import { cn } from "../../../shared/lib/clsx";

interface PropertyRulesFormProps {
  checkIn?: string;
  checkOut?: string;
  smoking?: SmokingPolicy;
  paymentMethod?: PaymentMethodType;
  onChange: (data: any) => void;
}

const SMOKING_OPTIONS = [
  { value: 'FORBIDDEN', label: 'Запрещено', icon: <Ban size={18} /> },
  { value: 'DESIGNATED_AREAS', label: 'В спец. местах', icon: <Ban size={18} className="opacity-50" /> },
  { value: 'ALLOWED', label: 'Разрешено', icon: <Clock size={18} /> },
];

const PAYMENT_OPTIONS = [
  { value: 'CASH_ONLY', label: 'Только наличные' },
  { value: 'CARD_ONLY', label: 'Только карта' },
  { value: 'CASH_AND_CARD', label: 'Наличные и карта' },
];

export const PropertyRulesForm: React.FC<PropertyRulesFormProps> = ({
  checkIn = "14:00",
  checkOut = "12:00",
  smoking = 'FORBIDDEN',
  paymentMethod = 'ANY',
  onChange
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-gray-900">Правила проживания</h2>
        <p className="mt-2 text-gray-500">Установите время заезда, выезда и основные правила вашего объекта.</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="checkIn" className="flex items-center gap-2">
              <Clock size={16} /> Время заезда (с)
            </Label>
            <Input
              id="checkIn"
              type="time"
              value={checkIn}
              onChange={(e) => onChange({ checkIn: e.target.value })}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="checkOut" className="flex items-center gap-2">
              <Clock size={16} /> Время выезда (до)
            </Label>
            <Input
              id="checkOut"
              type="time"
              value={checkOut}
              onChange={(e) => onChange({ checkOut: e.target.value })}
              className="h-12"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <Ban size={16} /> Курение на территории
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {SMOKING_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ smoking: opt.value as SmokingPolicy })}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all",
                  smoking === opt.value
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-100 hover:border-gray-200"
                )}
              >
                {opt.icon}
                <span className="text-sm font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <CreditCard size={16} /> Способ оплаты
          </Label>
          <div className="grid grid-cols-1 gap-2">
            {PAYMENT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ paymentMethod: opt.value as PaymentMethodType })}
                className={cn(
                  "flex items-center justify-between rounded-xl border-2 px-4 py-3 transition-all",
                  paymentMethod === opt.value
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-100 hover:border-gray-200"
                )}
              >
                <span className="font-medium">{opt.label}</span>
                {paymentMethod === opt.value && (
                  <div className="h-5 w-5 rounded-full bg-blue-600 p-1">
                    <div className="h-full w-full rounded-full bg-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
