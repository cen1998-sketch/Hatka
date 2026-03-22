import * as React from "react"
import { cn } from "../../lib/clsx.ts"
import s from "./NavButton.module.css"

interface NavButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  label: React.ReactNode;
  isActive?: boolean;
}

const NavButton = React.forwardRef<HTMLDivElement, NavButtonProps>(
  ({ icon, label, isActive = false, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(s.navButton, isActive && s.isActive, className)}
        {...props as any}
      >
        {icon && (
          <span className={s.iconWrapper}>
            {icon}
          </span>
        )}
        <span>{label}</span>
      </div>
    );
  }
);

NavButton.displayName = "NavButton";

export { NavButton };
