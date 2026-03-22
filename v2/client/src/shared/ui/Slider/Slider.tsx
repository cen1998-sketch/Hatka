import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "../../lib/clsx.ts"
import s from "./Slider.module.css"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(s.root, className)}
    {...props}
  >
    <SliderPrimitive.Track className={s.track}>
      <SliderPrimitive.Range className={s.range} />
    </SliderPrimitive.Track>
    {Array.from({ length: (props.value || props.defaultValue || [0]).length }).map((_, i) => (
      <SliderPrimitive.Thumb key={i} className={s.thumb} />
    ))}
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
