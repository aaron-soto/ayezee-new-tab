"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";

import Image from "next/image";
import { createPortal } from "react-dom";
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

  const displayIcon = iconPreview || currentIcon;

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
              <h2 className="mb-6 text-xl font-bold text-white">Edit Link</h2>

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

                {/* Icon Upload/Edit */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-300">
                    Icon
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg border border-neutral-700 p-4">
                      <Image
                        src={displayIcon}
                        alt="Icon"
                        width={32}
                        height={32}
                        className=""
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="button surface"
                      >
                        {iconFile ? "Change Icon" : "Upload New Icon"}
                      </button>
                      {iconFile && (
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
                          Cancel Upload
                        </button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
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
                    {isLoading ? "Saving..." : "Save Changes"}
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
