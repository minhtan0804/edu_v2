import { cva, type VariantProps } from "class-variance-authority";
import { type LucideIcon } from "lucide-react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

const iconWrapperVariants = cva("", {
  variants: {
    size: {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
      xl: "h-8 w-8",
      "2xl": "h-10 w-10",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface IconWrapperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof iconWrapperVariants> {
  icon: LucideIcon;
  label?: string;
}

const IconWrapper = forwardRef<HTMLDivElement, IconWrapperProps>(
  ({ className, size, icon: Icon, label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center justify-center", className)}
        aria-label={label}
        {...props}
      >
        <Icon className={cn(iconWrapperVariants({ size }))} />
      </div>
    );
  }
);

IconWrapper.displayName = "IconWrapper";

// eslint-disable-next-line react-refresh/only-export-components
export { IconWrapper, iconWrapperVariants };
