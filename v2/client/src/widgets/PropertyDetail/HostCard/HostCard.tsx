import * as React from "react";
import { Globe, Clock, ShieldCheck, ChevronRight } from "lucide-react";
import s from "./HostCard.module.css";

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
    <div className={s.card}>
      <div className={s.header}>
        <div className={s.avatarWrapper}>
          <img 
            src={host.avatar} 
            alt={host.name}
            className={s.avatar}
          />
        </div>
        <div className={s.authorCol}>
          <span className={s.authorName}>{host.name}</span>
          <span className={s.lastSeen}>{host.lastSeen}</span>
        </div>
      </div>

      <div className={s.infoList}>
        <div className={s.infoItem}>
          <ShieldCheck size={16} color="#0a0a0a" />
          <span className={s.infoText}>Обрабатывает запросы всегда</span>
        </div>
        <div className={s.infoItem}>
          <Globe size={16} color="#0a0a0a" />
          <span className={s.infoText}>
            Общается на языках: {host.languages.join(", ")}
          </span>
        </div>
        <div className={s.infoItem}>
          <Clock size={16} color="#0a0a0a" />
          <span className={s.infoText}>
            Среднее время отклика: {host.responseTime}
          </span>
        </div>
      </div>

      <div className={s.joinedDate}>
        Находится с нами с {host.joinedDate}
      </div>

      <button className={s.moreInfoBtn}>
        <span className={s.moreInfoText}>Сведения об исполнителе</span>
        <ChevronRight size={16} color="#0a0a0a" />
      </button>
    </div>
  );
}
