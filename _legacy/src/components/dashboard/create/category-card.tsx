"use client";

import { ReactNode } from "react";

interface CategoryCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  description: string;
}

export function CategoryCard({ icon, title, subtitle, description }: CategoryCardProps) {
  return (
    <div className="group relative w-full p-8 bg-white rounded-[24px] shadow-sm border border-transparent hover:border-orange-200 hover:shadow-md transition-all cursor-pointer flex flex-col gap-6">
      <div className="flex gap-4 items-start">
        <div className="w-12 h-12 flex items-center justify-center text-neutral-400 group-hover:text-orange-500 transition-colors">
          {icon}
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-neutral-950 text-xl font-bold leading-7">{title}</h3>
          <p className="text-muted-foreground text-sm font-medium leading-5">{subtitle}</p>
        </div>
      </div>
      
      <div className="pt-6 border-t border-gray-100">
        <p className="text-muted-foreground text-sm font-medium leading-5 group-hover:text-neutral-600 transition-colors">
          {description}
        </p>
      </div>
    </div>
  );
}
