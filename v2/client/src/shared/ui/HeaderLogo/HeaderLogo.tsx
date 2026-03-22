import * as React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { cn } from "../../lib/clsx.ts";
import s from "./HeaderLogo.module.css";

interface HeaderLogoProps {
  className?: string;
}

function HeaderLogo({ className }: HeaderLogoProps) {
  return (
    <Link
      to="/"
      className={cn(s.headerLogo, className)}
    >
      <div className={s.logoContainer}>
        <Home size={20} className="text-orange-500 fill-orange-500" strokeWidth={2.5} />
        <span className={s.text}>
          Хатка
        </span>
      </div>
    </Link>
  );
}

export { HeaderLogo };
