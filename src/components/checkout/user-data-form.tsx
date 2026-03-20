"use client";

import { Input } from "@/components/ui/input";
import { Pen } from "lucide-react";

export function UserDataForm() {
  return (
    <div className="w-full p-6 bg-white rounded-xl flex flex-col gap-6">
      <div className="flex flex-col gap-5">
        <h2 className="text-neutral-950 text-xl font-semibold leading-7">Ваши данные</h2>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input 
              defaultValue="Сергич" 
              className="h-11 bg-gray-100 border-none rounded-xl pr-10 text-neutral-950 font-medium"
            />
            <Pen className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
          <div className="flex-1 relative">
            <Input 
              defaultValue="Филиппов" 
              className="h-11 bg-gray-100 border-none rounded-xl pr-10 text-neutral-950 font-medium"
            />
            <Pen className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-muted-foreground text-xs font-semibold uppercase tracking-tight">Уведомления по бронированию и оплате</h3>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input 
              defaultValue="+7 (913) 321 7010" 
              className="h-11 bg-gray-100 border-none rounded-xl pr-10 text-neutral-950 font-medium"
            />
            <Pen className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
          <Input 
            placeholder="Электронная почта" 
            className="flex-1 h-11 bg-white border border-gray-100 rounded-xl text-neutral-950 font-medium"
          />
        </div>
      </div>
    </div>
  );
}
