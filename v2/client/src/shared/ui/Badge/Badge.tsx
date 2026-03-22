import * as React from "react"
import { cn } from "../../lib/clsx.ts"
import s from "./Badge.module.css"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'rating' | 'location' | 'verified'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div className={cn(s.badge, s[variant], className)} {...props} />
  )
}

export { Badge }
