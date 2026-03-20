"use client";

import { MessageSquare, Globe, Clock, ShieldCheck, ChevronRight } from "lucide-react";
import Image from "next/image";

interface HostInfo {
  name: string;
  avatar: string;
  lastSeen: string;
  languages: string[];
  responseTime: string;
  joinedDate: string;
}

interface HostCardProps {
  host: HostInfo;
}

export function HostCard({ host }: HostCardProps) {
  return (
    <div className="w-full lg:w-72 p-6 bg-white rounded-xl flex flex-col gap-5 h-fit">
      <div className="flex items-center gap-2">
        <div className="relative w-11 h-11 rounded-full overflow-hidden">
          <Image 
            src={host.avatar} 
            alt={host.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-foreground text-sm font-medium leading-5">{host.name}</span>
          <span className="text-muted-foreground text-xs font-medium leading-4">{host.lastSeen}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 border-t border-gray-50 pt-3">
        <div className="flex items-start gap-1">
          <ShieldCheck className="w-4 h-4 text-neutral-950" />
          <span className="text-neutral-950 text-xs font-medium leading-4">Обрабатывает запросы всегда</span>
        </div>
        <div className="flex items-start gap-1">
          <Globe className="w-4 h-4 text-neutral-950" />
          <span className="text-neutral-950 text-xs font-medium leading-4">
            Общается на языках: {host.languages.join(", ")}
          </span>
        </div>
        <div className="flex items-start gap-1">
          <Clock className="w-4 h-4 text-neutral-950" />
          <span className="text-neutral-950 text-xs font-medium leading-4">
            Среднее время отклика: {host.responseTime}
          </span>
        </div>
      </div>

      <div className="text-muted-foreground text-xs font-medium leading-4 mt-2">
        Находится с нами с {host.joinedDate}
      </div>

      <div className="p-3 bg-gray-100 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors">
        <span className="text-muted-foreground text-xs font-medium">Сведения об исполнителе</span>
        <ChevronRight className="w-4 h-4 text-neutral-950" />
      </div>
    </div>
  );
}
