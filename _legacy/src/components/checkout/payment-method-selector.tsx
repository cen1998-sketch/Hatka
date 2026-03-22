"use client";

import { useState } from "react";
import { CreditCard, Smartphone, Globe, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

const methods = [
  { id: "sbp", name: "СБП", description: "Приложение банка", icon: <Smartphone className="w-4 h-4" /> },
  { id: "card-ru", name: "Картой онлайн", description: "Российские банки", icon: <CreditCard className="w-4 h-4" /> },
  { id: "card-int", name: "Картой онлайн", description: "Зарубежные банки", icon: <Globe className="w-4 h-4" /> },
  { id: "other", name: "Оплатит другой", description: "Ссылка для оплаты", icon: <Link2 className="w-4 h-4" /> },
];

export function PaymentMethodSelector() {
  const [selected, setSelected] = useState("sbp");

  return (
    <div className="w-full p-6 bg-white rounded-xl flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-neutral-950 text-xl font-semibold leading-7">Способы оплаты</h2>
        <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
           <p className="text-orange-900 text-xs font-semibold">Бронирование не оплачено</p>
           <p className="text-orange-900/70 text-[10px] font-medium leading-3">Вы ещё не внесли предоплату, можете изменить детали бронирования и выбрать другой способ оплаты</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {methods.map((method) => (
          <div 
            key={method.id}
            onClick={() => setSelected(method.id)}
            className={cn(
              "p-3 rounded-2xl flex items-center justify-between cursor-pointer border-2 transition-all",
              selected === method.id ? "bg-gray-100 border-gray-100" : "bg-white border-transparent hover:bg-gray-50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                {method.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-neutral-950 text-sm font-semibold">{method.name}</span>
                <span className="text-muted-foreground text-[10px] font-medium">{method.description}</span>
              </div>
            </div>
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center",
              selected === method.id ? "border-amber-500" : "border-gray-200"
            )}>
              {selected === method.id && <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
