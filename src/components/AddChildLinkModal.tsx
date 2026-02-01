"use client";

import Modal, { ModalCancel, ModalConfirm } from "@/components/Modal";
import { useRef, useState, useEffect } from "react";

import IconUploader from "@/components/IconUploader";
import Label from "@/components/Label";
import { useRouter } from "next/navigation";
import { getFaviconUrl } from "@/lib/favicon";

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
  const [isFetchingFavicon, setIsFetchingFavicon] = useState(false);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [hasCustomIcon, setHasCustomIcon] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-fetch favicon when URL changes
  useEffect(() => {
    const fetchFavicon = async () => {
      if (!url || hasCustomIcon) return;

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
  }, [url, hasCustomIcon]);

  // Handle paste event to immediately fetch favicon
  const handleUrlPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedUrl = e.clipboardData.getData("text");
    if (pastedUrl && !hasCustomIcon) {
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
      formData.append("parentId", parentId);
      formData.append("label", label.trim());
      formData.append("href", url.trim());

      // If user uploaded a custom icon, use that
      if (iconFile) {
        formData.append("icon", iconFile);
      } else if (faviconUrl && !hasCustomIcon) {
        // Otherwise, use the favicon URL
        formData.append("faviconUrl", faviconUrl);
      } else {
        setError("Please select an icon or enter a URL");
        setIsLoading(false);
        return;
      }

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
      setFaviconUrl(null);
      setHasCustomIcon(false);

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
            onPaste={handleUrlPaste}
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
            onCustomIconSelected={() => setHasCustomIcon(true)}
            isFetchingFavicon={isFetchingFavicon}
          />
          <p className="mt-1 text-xs text-neutral-500">
            {url && !hasCustomIcon
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
            label={isLoading ? "Creating..." : "Add Link"}
          />
        </div>
      </form>
    </Modal>
  );
}
