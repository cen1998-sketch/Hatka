import * as React from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import s from "./DashboardHeader.module.css";

interface DashboardHeaderProps {
  count: number;
}

export function DashboardHeader({ count }: DashboardHeaderProps) {
  return (
    <div className={s.header}>
      <div className={s.titleBox}>
        <h1 className={s.title}>{count} объявления</h1>
      </div>
      
      <Link to="/dashboard/create" className={s.createBtn}>
        <Plus size={16} />
        <span className={s.createBtnText}>Создать новое объявление</span>
      </Link>
    </div>
  );
}
