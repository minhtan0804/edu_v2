import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/feedback/dialog";
import { Spinner } from "@/components/ui/feedback/spinner";
import { Button } from "@/components/ui/general/button";
import { cn } from "@/lib/utils";

const confirmModalVariants = cva("", {
  variants: {
    variant: {
      default: "text-gray-900",
      danger: "text-destructive",
      warning: "text-orange-500",
      info: "text-blue-500",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ConfirmModalProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof confirmModalVariants> {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  isLoading = false,
  variant,
  className,
  ...props
}: ConfirmModalProps) {
  const { t } = useTranslation();

  const handleConfirm = (): void => {
    if (!isLoading) {
      onConfirm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-[425px]", className)} {...props}>
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <AlertTriangle
              className={cn("h-6 w-6", confirmModalVariants({ variant }))}
            />
          </div>
          <DialogTitle className={cn(confirmModalVariants({ variant }))}>
            {title}
          </DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="min-w-[80px]"
          >
            {cancelText || t("common.cancel")}
          </Button>
          <Button
            variant={variant === "danger" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isLoading}
            className="min-w-[80px]"
          >
            {isLoading ? (
              <Spinner size="sm" variant="muted" />
            ) : (
              confirmText || t("common.confirm")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
