"use client";

import Modal, { ModalCancel, ModalConfirm } from "@/components/Modal";
import { useRef, useState } from "react";

import IconUploader from "@/components/IconUploader";
import Label from "@/components/Label";
import { useRouter } from "next/navigation";

interface AddChildLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentId: string;
  parentLabel: string;
}

export default function AddChildLinkModal({
  isOpen,
  onClose,
  parentId,
  parentLabel,
}: AddChildLinkModalProps) {
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
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
      if (!iconFile) {
        setError("Please select an icon");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("parentId", parentId);
      formData.append("label", label.trim());
      formData.append("href", url.trim());
      formData.append("icon", iconFile);

      const response = await fetch("/api/links/children", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create child link");
      }

      // Reset form
      setLabel("");
      setUrl("");
      setIconFile(null);
      setIconPreview(null);

      // Close modal and refresh
      onClose();
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create child link",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setLabel("");
    setUrl("");
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
      <h2 className="mb-2 text-xl font-bold text-white">Add Child Link</h2>
      <p className="mb-6 text-sm text-neutral-400">
        Add a child link to <span className="text-white">{parentLabel}</span>
      </p>

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
            required
          />
        </div>

        {/* Icon Upload */}
        <div>
          <Label htmlFor="icon">Icon</Label>

          <IconUploader
            iconPreview={iconPreview}
            setIconPreview={setIconPreview}
            setIconFile={setIconFile}
            fileInputRef={fileInputRef}
            disabled={isLoading}
            id="icon"
          />
          <p className="mt-1 text-xs text-neutral-500">
            PNG, JPG, or SVG (max 5MB)
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
          <ModalCancel onClick={handleClose} disabled={isLoading} />
          <ModalConfirm
            disabled={isLoading}
            label={isLoading ? "Creating..." : "Add Link"}
          />
        </div>
      </form>
    </Modal>
  );
}
