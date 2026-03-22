"use client";

import { Button } from "@/components/ui/button";
import { Tag, Bell, Info, Coins } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface CheckoutSideCardProps {
  totalPrice: number;
  prepayment: number;
  cashback: number;
}

export function CheckoutSideCard({ totalPrice, prepayment }: CheckoutSideCardProps) {
  const formatPrice = (p: number) => p.toLocaleString("ru-RU") + " ₽";

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Main Payment Card */}
      <div className="w-full p-6 bg-white rounded-xl flex flex-col gap-6 shadow-sm">
        <Button className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-base font-semibold border-none">
          Оплатить {formatPrice(prepayment)}
        </Button>
        <p className="text-muted-foreground text-[10px] font-medium leading-3 text-center px-4">
          Нажимая кнопку «Оплатить», вы соглашаетесь с правилами объекта размещения и бронирования
        </p>
      </div>

      {/* Pricing Details */}
      <div className="w-full p-6 bg-white rounded-xl flex flex-col gap-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <h2 className="text-neutral-950 text-xl font-semibold leading-7">Расчёт стоимости</h2>
          
          <div className="flex justify-between items-baseline">
            <span className="text-muted-foreground text-xs font-medium">Стоимость проживания за 24 суток</span>
            <span className="text-neutral-950 text-base font-semibold">{formatPrice(totalPrice)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-baseline">
            <span className="text-neutral-950 text-xl font-semibold leading-7">Итого</span>
            <span className="text-neutral-950 text-xl font-semibold leading-7">{formatPrice(totalPrice)}</span>
          </div>

          <div className="flex justify-between items-center py-2 px-3 bg-gray-100 rounded-xl">
             <div className="flex items-center gap-1 text-muted-foreground text-xs font-medium">
               <span>Предоплата</span>
               <Info className="w-3 h-3" />
             </div>
             <span className="text-neutral-950 text-xs font-bold">{formatPrice(prepayment)}</span>
          </div>

          <div className="flex justify-between items-center px-3">
             <span className="text-muted-foreground text-xs font-medium">Оплата при заселении</span>
             <span className="text-neutral-950 text-xs font-bold">{formatPrice(totalPrice - prepayment)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
