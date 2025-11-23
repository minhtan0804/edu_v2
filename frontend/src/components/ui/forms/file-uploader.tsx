import { cva, type VariantProps } from "class-variance-authority";
import { Upload, X } from "lucide-react";
import { forwardRef, useCallback, useState } from "react";

import { cn } from "@/lib/utils";

// Note: Button component from shadcn/ui is required
// Install with: npx shadcn@latest add button
import { Button } from "../general/button";

const fileUploaderVariants = cva(
  "relative flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg transition-colors cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100",
        primary:
          "border-primary-300 bg-primary-50 hover:border-primary-400 hover:bg-primary-100",
        destructive:
          "border-destructive-300 bg-destructive-50 hover:border-destructive-400 hover:bg-destructive-100",
      },
      size: {
        sm: "p-4 min-h-[120px]",
        md: "p-6 min-h-[160px]",
        lg: "p-8 min-h-[200px]",
      },
      isDragActive: {
        true: "border-primary-500 bg-primary-100",
        false: "",
      },
      isDisabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      isDragActive: false,
      isDisabled: false,
    },
  }
);

export interface FileUploaderProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "onChange" | "type" | "size"
    >,
    VariantProps<typeof fileUploaderVariants> {
  onFilesSelected?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in bytes
  label?: string;
  description?: string;
  error?: string;
}

const FileUploader = forwardRef<HTMLInputElement, FileUploaderProps>(
  (
    {
      className,
      variant,
      size,
      onFilesSelected,
      accept,
      multiple = false,
      maxFiles,
      maxSize,
      label = "Click to upload or drag and drop",
      description = "SVG, PNG, JPG or GIF (MAX. 5MB)",
      error,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isDragActive, setIsDragActive] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const validateFiles = useCallback(
      (files: File[]): File[] => {
        let validFiles = files;

        // Filter by maxSize
        if (maxSize) {
          validFiles = validFiles.filter((file) => file.size <= maxSize);
        }

        // Limit by maxFiles
        if (maxFiles && validFiles.length > maxFiles) {
          validFiles = validFiles.slice(0, maxFiles);
        }

        return validFiles;
      },
      [maxSize, maxFiles]
    );

    const handleFiles = useCallback(
      (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);
        const validFiles = validateFiles(fileArray);

        if (validFiles.length > 0) {
          setSelectedFiles((prev) => {
            const newFiles = multiple ? [...prev, ...validFiles] : validFiles;
            onFilesSelected?.(newFiles);
            return newFiles;
          });
        }
      },
      [multiple, validateFiles, onFilesSelected]
    );

    const handleDrag = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setIsDragActive(true);
      } else if (e.type === "dragleave") {
        setIsDragActive(false);
      }
    }, []);

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (disabled) return;

        const files = e.dataTransfer.files;
        handleFiles(files);
      },
      [disabled, handleFiles]
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        handleFiles(e.target.files);
      },
      [disabled, handleFiles]
    );

    const removeFile = useCallback(
      (index: number) => {
        setSelectedFiles((prev) => {
          const newFiles = prev.filter((_, i) => i !== index);
          onFilesSelected?.(newFiles);
          return newFiles;
        });
      },
      [onFilesSelected]
    );

    const clearAll = useCallback(() => {
      setSelectedFiles([]);
      onFilesSelected?.([]);
    }, [onFilesSelected]);

    return (
      <div className="w-full space-y-2">
        <div
          className={cn(
            fileUploaderVariants({
              variant,
              size,
              isDragActive,
              isDisabled: disabled,
            }),
            error && "border-destructive",
            className
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={ref}
            type="file"
            className="hidden"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={handleChange}
            {...props}
          />
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="mb-1 text-sm font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                if (ref && typeof ref !== "function" && ref.current) {
                  ref.current.click();
                }
              }}
              disabled={disabled}
            >
              Select Files
            </Button>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""}{" "}
                selected
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearAll}
                disabled={disabled}
              >
                Clear all
              </Button>
            </div>
            <div className="space-y-1">
              {selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between rounded-md border p-2 text-sm"
                >
                  <div className="flex-1 truncate">
                    <p className="truncate font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-6 w-6 p-0"
                    onClick={() => removeFile(index)}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

FileUploader.displayName = "FileUploader";

// eslint-disable-next-line react-refresh/only-export-components
export { FileUploader, fileUploaderVariants };
