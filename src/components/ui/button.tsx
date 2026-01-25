import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { RoughOverlay } from "./RoughBox"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  roughShape?: 'rectangle' | 'circle' | 'rounded';
  roughCornerRadius?: number;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, roughShape, roughCornerRadius, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      )
    }

    // Default shape logic if not provided
    // If rounded-full is in className, user might want circle. But we can't reliably detect className strings here safely.
    // So we rely on props.
    // Default to 'rounded' with small radius if no shape provided, to match rounded-md
    const shape = roughShape || 'rounded';
    const radius = roughCornerRadius || 6; // rounded-md is 0.375rem = 6px
    
    // Add seed state for hover jiggle
    const [seed, setSeed] = React.useState(0);

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }), "relative overflow-hidden border-transparent")}
        ref={ref}
        onMouseEnter={(e) => {
            setSeed(1); // Set to specific seed for hover state
            props.onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
            setSeed(0); // Reset to default seed
            props.onMouseLeave?.(e);
        }}
        {...props}
      >
        <RoughOverlay 
            roughness={2} 
            strokeWidth={2} 
            shape={shape}
            cornerRadius={radius}
            seed={seed}
        />
        <span className="relative z-10 flex items-center justify-center gap-2">
           {props.children}
        </span>
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
