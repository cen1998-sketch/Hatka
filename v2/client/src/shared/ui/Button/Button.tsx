import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../lib/clsx.ts"
import s from "./Button.module.css"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'glass';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(
          s.button,
          s[variant],
          s[`size${size.charAt(0).toUpperCase() + size.slice(1)}`],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
