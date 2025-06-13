import React, { useRef, useState } from "react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
  preview?: boolean;
  className?: string;
  placeholder?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = "image/*",
  maxSize = 5,
  preview = true,
  className,
  placeholder = "Seleccionar archivo",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setError(null);

    if (file) {
      console.log("FileUpload - File selected:", {
        name: file.name,
        type: file.type,
        size: file.size,
        extension: file.name
          .toLowerCase()
          .substring(file.name.lastIndexOf(".")),
      });
      console.log("FileUpload - Accept prop:", accept);

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`El archivo debe ser menor a ${maxSize}MB`);
        return;
      }

      // Validate file type - handle both MIME types and extensions
      if (accept) {
        const acceptedTypes = accept.split(",").map((type) => type.trim());
        console.log("FileUpload - Accepted types:", acceptedTypes);
        let isValidType = false;

        for (const acceptType of acceptedTypes) {
          if (acceptType.startsWith(".")) {
            // Extension-based validation
            const fileExtension = file.name
              .toLowerCase()
              .substring(file.name.lastIndexOf("."));
            console.log(
              `FileUpload - Checking extension: ${fileExtension} vs ${acceptType.toLowerCase()}`
            );
            if (fileExtension === acceptType.toLowerCase()) {
              console.log("FileUpload - Extension match found!");
              isValidType = true;
              break;
            }
          } else {
            // MIME type validation
            console.log(
              `FileUpload - Checking MIME: ${file.type} vs ${acceptType}`
            );
            if (file.type.match(acceptType.replace("*", ".*"))) {
              console.log("FileUpload - MIME match found!");
              isValidType = true;
              break;
            }
          }
        }

        console.log("FileUpload - Is valid type:", isValidType);
        if (!isValidType) {
          setError("Tipo de archivo no válido");
          return;
        }
      }

      setSelectedFile(file);
      onFileSelect(file);

      // Create preview URL for images
      if (preview && file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
      onFileSelect(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-3", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {!selectedFile ? (
        <div
          onClick={handleButtonClick}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          <div className="space-y-2">
            <div className="text-gray-400">
              <svg
                className="mx-auto h-12 w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">{placeholder}</p>
              <p className="text-xs text-gray-500">Máximo {maxSize}MB</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {preview && previewUrl && (
            <div className="flex justify-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-lg border"
              />
            </div>
          )}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="text-green-500">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveFile}
            >
              Remover
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
