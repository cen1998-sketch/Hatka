import { NavButton } from "@/components/ui/nav-button";
import Link from "next/link";
import { Plus } from "lucide-react";

interface DashboardHeaderProps {
  count: number;
}

export function DashboardHeader({ count }: DashboardHeaderProps) {
  return (
    <div className="w-full flex justify-between items-end pb-4 border-b border-neutral-100">
      <div className="flex flex-col gap-1">
        <h1 className="text-neutral-900 text-3xl font-bold font-['NT_Somic']">{count} объявления</h1>
      </div>
      
      <Link href="/dashboard/create">
        <NavButton 
          label="Создать новое объявление" 
          icon={<Plus className="w-4 h-4" />}
          className="h-11 shadow-sm active:shadow-inner"
        />
      </Link>
    </div>
  );
}
