"use client";

import Modal, { ModalCancel, ModalConfirm } from "@/components/Modal";
import { useEffect, useRef, useState } from "react";

import IconUploader from "@/components/IconUploader";
import Label from "@/components/Label";
import { getFaviconUrl } from "@/lib/favicon";
import { useRouter } from "next/navigation";

interface EditChildLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  childId: string;
  currentLabel: string;
  currentUrl: string;
  currentIcon: string;
}

export default function EditChildLinkModal({
  isOpen,
  onClose,
  childId,
  currentLabel,
  currentUrl,
  currentIcon,
}: EditChildLinkModalProps) {
  const router = useRouter();
  const [label, setLabel] = useState(currentLabel);
  const [url, setUrl] = useState(currentUrl);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingFavicon, setIsFetchingFavicon] = useState(false);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [hasCustomIcon, setHasCustomIcon] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-fetch favicon when URL changes (only if different from current)
  useEffect(() => {
    const fetchFavicon = async () => {
      if (!url || url === currentUrl || hasCustomIcon) return;

      // Only fetch if URL contains a valid TLD
      const hasTLD =
        /\.(com|org|net|edu|gov|mil|int|io|co|ai|app|dev|tech|me|info|biz|name|pro|museum|coop|aero|xxx|idv|xyz|online|site|store|shop|blog|cloud|digital|email|live|news|today|world|tv|fm|am|fm|uk|us|ca|de|fr|jp|cn|au|br|in|ru|es|it|nl|se|no|dk|fi|pl|ch|at|be|gr|pt|cz|ie|nz|sg|hk|za|ar|mx|cl|co\.uk|co\.jp|co\.kr|co\.nz|co\.za|com\.au|com\.br|com\.cn|com\.mx|gov\.uk|ac\.uk)($|\/|:)/i.test(
          url,
        );

      if (!hasTLD) return;

      setIsFetchingFavicon(true);
      const favicon = getFaviconUrl(url);
      if (favicon) {
        setFaviconUrl(favicon);
        setIconPreview(favicon);
      }
      setIsFetchingFavicon(false);
    };

    // Debounce the favicon fetch
    const timeoutId = setTimeout(fetchFavicon, 500);
    return () => clearTimeout(timeoutId);
  }, [url, currentUrl, hasCustomIcon]);

  // Handle paste event to immediately fetch favicon
  const handleUrlPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedUrl = e.clipboardData.getData("text");
    if (pastedUrl && pastedUrl !== currentUrl && !hasCustomIcon) {
      // Check if pasted text has valid TLD
      const hasTLD =
        /\.(com|org|net|edu|gov|mil|int|io|co|ai|app|dev|tech|me|info|biz|name|pro|museum|coop|aero|xxx|idv|xyz|online|site|store|shop|blog|cloud|digital|email|live|news|today|world|tv|fm|am|fm|uk|us|ca|de|fr|jp|cn|au|br|in|ru|es|it|nl|se|no|dk|fi|pl|ch|at|be|gr|pt|cz|ie|nz|sg|hk|za|ar|mx|cl|co\.uk|co\.jp|co\.kr|co\.nz|co\.za|com\.au|com\.br|com\.cn|com\.mx|gov\.uk|ac\.uk)($|\/|:)/i.test(
          pastedUrl,
        );

      if (hasTLD) {
        setIsFetchingFavicon(true);
        const favicon = getFaviconUrl(pastedUrl);
        if (favicon) {
          setFaviconUrl(favicon);
          setIconPreview(favicon);
        }
        setIsFetchingFavicon(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("id", childId);
      formData.append("label", label.trim());
      formData.append("href", url.trim());

      // If user uploaded a custom icon, use that
      if (iconFile) {
        formData.append("icon", iconFile);
      } else if (faviconUrl && !hasCustomIcon && url !== currentUrl) {
        // If URL changed and we have a new favicon, use it
        formData.append("faviconUrl", faviconUrl);
      }

      const response = await fetch("/api/links/children", {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update child link");
      }

      // Close modal and refresh
      onClose();
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update child link",
      );
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
    setFaviconUrl(null);
    setHasCustomIcon(false);
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
      <h2 className="mb-6 text-xl font-bold text-white">Edit Child Link</h2>

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
          <Label htmlFor="url">URL</Label>

          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onPaste={handleUrlPaste}
            className="input"
            placeholder="https://example.com"
            required
          />
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
            onCustomIconSelected={() => setHasCustomIcon(true)}
            isFetchingFavicon={isFetchingFavicon}
          />
          <p className="text-muted-foreground mt-1 text-xs">
            {iconFile
              ? "New icon will replace the current one"
              : url && url !== currentUrl && !hasCustomIcon
                ? "Auto-fetched favicon • Upload custom icon to replace"
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
          <ModalCancel onClick={handleClose} disabled={isLoading} />
          <ModalConfirm
            disabled={isLoading}
            label={isLoading ? "Saving..." : "Save Changes"}
          />
        </div>
      </form>
    </Modal>
  );
}
