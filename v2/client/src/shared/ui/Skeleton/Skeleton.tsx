import { cn } from "../../lib/clsx.ts"
import s from "./Skeleton.module.css"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(s.skeleton, className)}
      {...props}
    />
  )
}

export { Skeleton }
