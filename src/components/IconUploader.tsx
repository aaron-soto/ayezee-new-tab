"use client";

import Image from "next/image";
import React from "react";

type Props = {
  iconPreview: string | null;
  setIconPreview: (v: string | null) => void;
  setIconFile: (f: File | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  disabled?: boolean;
  currentIcon?: string; // Optional: for edit mode to show the existing icon
  id?: string; // Optional: for label accessibility
};

export default function IconUploader({
  iconPreview,
  setIconPreview,
  setIconFile,
  fileInputRef,
  disabled = false,
  currentIcon,
  id,
}: Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      // parent can show an error if needed
      setIconFile(null);
      setIconPreview(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setIconFile(null);
      setIconPreview(null);
      return;
    }

    setIconFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setIconPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const displayIcon = iconPreview || currentIcon;

  return (
    <div className="flex items-center gap-4">
      {displayIcon && (
        <div className="bg-foreground/5 grid aspect-square place-items-center rounded-lg p-4">
          <Image
            src={displayIcon}
            alt="Icon"
            width={32}
            height={32}
            className=""
          />
        </div>
      )}

      {iconPreview ? (
        <button
          type="button"
          onClick={() => {
            setIconFile(null);
            setIconPreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          className="button surface"
          disabled={disabled}
        >
          Remove
        </button>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="button bg-foreground/5! text-muted-foreground! hover:text-foreground! flex gap-2"
          disabled={disabled}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm">Choose Icon</span>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
        id={id}
      />
    </div>
  );
}
