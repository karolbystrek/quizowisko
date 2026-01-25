import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { RoughOverlay } from "./RoughBox"

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void
  stroke?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, onChange, stroke, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onCheckedChange?.(e.target.checked)
      onChange?.(e)
    }

    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          className="peer h-4 w-4 shrink-0 opacity-0 absolute inset-0 cursor-pointer z-10"
          ref={ref}
          checked={checked}
          onChange={handleChange}
          {...props}
        />
        <div
          className={cn(
            "relative h-4 w-4 shrink-0 rounded-sm border border-transparent ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center pointer-events-none",
            checked ? "text-primary" : "text-muted-foreground",
            className
          )}
        >
           <RoughOverlay 
              key={checked ? "checked" : "unchecked"}
              shape="rounded" 
              cornerRadius={4} 
              stroke={stroke || "currentColor"} 
              strokeWidth={2}
              roughness={1}
              drawCheck={checked}
           />
        </div>
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
