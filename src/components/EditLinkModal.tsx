"use client";

import Modal, { ModalCancel, ModalConfirm } from "@/components/Modal";
import { useRef, useState } from "react";

import IconUploader from "@/components/IconUploader";
import Label from "@/components/Label";
import { useRouter } from "next/navigation";

interface EditLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkId: string;
  currentLabel: string;
  currentUrl: string;
  currentIcon: string;
}

export default function EditLinkModal({
  isOpen,
  onClose,
  linkId,
  currentLabel,
  currentUrl,
  currentIcon,
}: EditLinkModalProps) {
  const router = useRouter();
  const [label, setLabel] = useState(currentLabel);
  const [url, setUrl] = useState(currentUrl);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("id", linkId);
      formData.append("label", label.trim());
      formData.append("href", url.trim());

      if (iconFile) {
        formData.append("icon", iconFile);
      }

      const response = await fetch("/api/links", {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update link");
      }

      // Close modal and refresh
      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setLabel(currentLabel);
    setUrl(currentUrl);
    setIconFile(null);
    setIconPreview(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="bg-foreground/5 rounded-xl p-6 shadow-2xl backdrop-blur-2xl"
      sizeClass="max-w-md"
    >
      <h2 className="mb-6 text-xl font-bold text-white">Edit Link</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Label Input */}
        <div>
          <Label htmlFor="label">Label</Label>

          <input
            type="text"
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="input"
            placeholder="Enter link label"
            required
            autoFocus
          />
        </div>

        {/* URL Input */}
        <div>
          <Label htmlFor="url">
            URL <span className="text-muted-foreground">(optional)</span>
          </Label>

          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input"
            placeholder="https://example.com"
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Leave empty for folder/parent icons
          </p>
        </div>

        {/* Icon Upload/Edit */}
        <div>
          <Label htmlFor="icon">Icon</Label>

          <IconUploader
            iconPreview={iconPreview}
            setIconPreview={setIconPreview}
            setIconFile={setIconFile}
            fileInputRef={fileInputRef}
            disabled={isLoading}
            currentIcon={currentIcon}
            id="icon"
          />
          <p className="text-muted-foreground mt-1 text-xs">
            {iconFile
              ? "New icon will replace the current one"
              : "PNG, JPG, or SVG (max 5MB)"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-900/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <ModalCancel
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </ModalCancel>

          <ModalConfirm
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1"
          >
            Confirm
          </ModalConfirm>
        </div>
      </form>
    </Modal>
  );
}
