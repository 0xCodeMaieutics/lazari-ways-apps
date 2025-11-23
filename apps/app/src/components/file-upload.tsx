import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Upload, X, File, FileImage } from "lucide-react";

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  value?: File | File[] | null;
  onChange?: (files: File | File[] | null) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  required?: boolean;
  id?: string;
}

const FileUpload = ({
  accept,
  multiple = false,
  value,
  onChange,
  placeholder = "Datei auswählen",
  className,
  error,
  required,
  id,
  ...props
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = inputRef;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (multiple) {
      const fileArray = Array.from(files);
      onChange?.(fileArray.length > 0 ? fileArray : null);
    } else {
      onChange?.(files[0] || null);
    }
  };

  const handleRemoveFile = (indexToRemove?: number) => {
    if (multiple && Array.isArray(value)) {
      const newFiles = value.filter((_, index) => index !== indexToRemove);
      onChange?.(newFiles.length > 0 ? newFiles : null);
    } else {
      onChange?.(null);
      if (fileInputRef && "current" in fileInputRef && fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const openFileDialog = () => {
    if (fileInputRef && "current" in fileInputRef && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (extension === "pdf") {
      return <File className="h-4 w-4" />;
    } else if (
      ["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")
    ) {
      return <FileImage className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderFileList = () => {
    if (!value) return null;

    const files = Array.isArray(value) ? value : [value];

    return (
      <div className="mt-2 space-y-2">
        {files.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className="flex items-center justify-between p-2 bg-muted rounded-md"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {getFileIcon(file.name)}
              <span className="text-sm truncate">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                ({formatFileSize(file.size)})
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveFile(multiple ? index : undefined)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  console.log({ value });

  return (
    <div className={cn("space-y-2", className)}>
      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        id={id}
        aria-required={required}
        {...props}
      />

      {(value === undefined || value === null) && (
        <div
          className={cn(
            "border-2 border-dashed border-input rounded-md p-4 text-center cursor-pointer transition-colors hover:border-primary/50",
            error && "border-destructive"
          )}
          onClick={openFileDialog}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">{placeholder}</p>
          <Button type="button" variant="outline" size="sm">
            Durchsuchen
          </Button>
          {accept && (
            <p className="text-xs text-muted-foreground mt-1">
              Erlaubte Dateiformate:{" "}
              {accept
                .split(",")
                .map((type) => type.trim().replace(".", ""))
                .join(", ")}
            </p>
          )}
        </div>
      )}

      {renderFileList()}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

FileUpload.displayName = "FileUpload";

export { FileUpload };
