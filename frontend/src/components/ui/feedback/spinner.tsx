import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-8 w-8",
      xl: "h-12 w-12",
    },
    variant: {
      default: "text-primary",
      muted: "text-muted-foreground",
      destructive: "text-destructive",
      success: "text-success-500",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center", className)}
        role="status"
        aria-label={label || "Loading"}
        {...props}
      >
        <Loader2 className={cn(spinnerVariants({ size, variant }))} />
        {label && (
          <span className="sr-only ml-2 text-sm text-muted-foreground">
            {label}
          </span>
        )}
      </div>
    );
  }
);

Spinner.displayName = "Spinner";

export { Spinner };
