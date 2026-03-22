import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "../../lib/clsx.ts"
import s from "./Switch.module.css"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(s.root, className)}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb className={s.thumb} />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
