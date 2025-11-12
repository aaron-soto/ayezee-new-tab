"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";

import Image from "next/image";
import { createPortal } from "react-dom";
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }
      setIconFile(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <div
            className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-surface w-full max-w-md rounded-xl p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="mb-2 text-xl font-bold text-white">
                Add Child Link
              </h2>
              <p className="mb-6 text-sm text-neutral-400">
                Add a child link to{" "}
                <span className="text-white">{parentLabel}</span>
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Label Input */}
                <div>
                  <label
                    htmlFor="label"
                    className="mb-2 block text-sm font-medium text-neutral-300"
                  >
                    Label
                  </label>
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
                  <label
                    htmlFor="url"
                    className="mb-2 block text-sm font-medium text-neutral-300"
                  >
                    URL
                  </label>
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
                  <label className="mb-2 block text-sm font-medium text-neutral-300">
                    Icon
                  </label>
                  <div className="flex items-center gap-4">
                    {iconPreview ? (
                      <div className="flex items-center gap-3">
                        <Image
                          src={iconPreview}
                          alt="Icon preview"
                          width={48}
                          height={48}
                          className="rounded-lg border border-neutral-700"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setIconFile(null);
                            setIconPreview(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          className="button surface"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="button surface"
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
                    />
                  </div>
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
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="button surface flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="button flex-1"
                  >
                    {isLoading ? "Creating..." : "Create Child Link"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
