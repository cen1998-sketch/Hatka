"use client";

import { Button } from "@/components/ui/button";

interface TypeSpecificCardProps {
  title: string;
  id: string;
  description: string;
}

export function TypeSpecificCard({ title, id, description }: TypeSpecificCardProps) {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-col">
        <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">ID {id}</span>
        <h2 className="text-neutral-950 text-2xl font-semibold leading-8">{title}</h2>
        <p className="text-muted-foreground text-xs font-medium leading-4">{description}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button className="h-9 px-6 bg-white border border-neutral-200 text-neutral-950 text-xs font-bold rounded-md hover:bg-neutral-50 shadow-sm">
          Редактировать информацию об отеле
        </Button>
        <Button size="sm" variant="ghost" className="h-9 bg-white border border-neutral-200 text-neutral-950 text-xs font-bold rounded-md hover:bg-neutral-50">
          Ещё
        </Button>
      </div>
    </div>
  );
}
