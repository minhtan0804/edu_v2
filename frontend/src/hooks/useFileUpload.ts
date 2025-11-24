import { useCallback, useState } from "react";

export interface UseFileUploadOptions {
  maxFiles?: number;
  maxSize?: number; // in bytes
  multiple?: boolean;
  onFilesSelected?: (files: File[]) => void;
}

export interface UseFileUploadReturn {
  selectedFiles: File[];
  isDragActive: boolean;
  handleFiles: (files: FileList | null) => void;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
  clearAll: () => void;
  setIsDragActive: (isActive: boolean) => void;
}

export function useFileUpload(
  options: UseFileUploadOptions = {}
): UseFileUploadReturn {
  const { maxFiles, maxSize, multiple = false, onFilesSelected } = options;
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

      const files = e.dataTransfer.files;
      handleFiles(files);
    },
    [handleFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    },
    [handleFiles]
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

  return {
    selectedFiles,
    isDragActive,
    handleFiles,
    handleDrag,
    handleDrop,
    handleChange,
    removeFile,
    clearAll,
    setIsDragActive,
  };
}
