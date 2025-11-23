import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-[8px] border border-[#9d9d9d] bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground transition-colors focus-visible:outline-none focus-visible:border-[#ff782d] focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-auto py-[10px] px-[24px] text-[18px] leading-[1.5]",
        sm: "h-auto py-[10px] px-[15px] text-[14px] leading-[1.5]",
        lg: "h-auto py-[10px] px-[24px] text-[18px] leading-[1.5]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          inputVariants({ size }),
          "placeholder:text-[#9d9d9d]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// eslint-disable-next-line react-refresh/only-export-components
export { Input, inputVariants };
