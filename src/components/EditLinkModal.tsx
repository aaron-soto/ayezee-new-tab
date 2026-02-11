"use client";

import Modal, { ModalCancel, ModalConfirm } from "@/components/Modal";
import { useEffect, useRef, useState } from "react";

import AddChildLinkModal from "@/components/AddChildLinkModal";
import IconUploader from "@/components/IconUploader";
import Label from "@/components/Label";
import { getFaviconUrl } from "@/lib/favicon";
import { useRouter } from "next/navigation";

interface EditLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkId: string;
  currentLabel: string;
  currentUrl: string;
  currentIcon: string;
  children?: Array<{
    id: string;
    label: string;
    href: string;
    icon: string;
  }>;
}

export default function EditLinkModal({
  isOpen,
  onClose,
  linkId,
  currentLabel,
  currentUrl,
  currentIcon,
  children,
}: EditLinkModalProps) {
  const router = useRouter();
  const [label, setLabel] = useState(currentLabel);
  const [url, setUrl] = useState(currentUrl);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingFavicon, setIsFetchingFavicon] = useState(false);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [editingChildLabel, setEditingChildLabel] = useState("");
  const [editingChildUrl, setEditingChildUrl] = useState("");
  const [editingChildIconFile, setEditingChildIconFile] = useState<File | null>(
    null,
  );
  const [editingChildIconPreview, setEditingChildIconPreview] = useState<
    string | null
  >(null);
  const [hasCustomIcon, setHasCustomIcon] = useState(false);
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const childFileInputRef = useRef<HTMLInputElement>(null);

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
      formData.append("id", linkId);
      formData.append("label", label.trim());
      formData.append("href", url.trim());

      // If user uploaded a custom icon, use that
      if (iconFile) {
        formData.append("icon", iconFile);
      } else if (faviconUrl && !hasCustomIcon && url !== currentUrl) {
        // If URL changed and we have a new favicon, use it
        formData.append("faviconUrl", faviconUrl);
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
    setFaviconUrl(null);
    setHasCustomIcon(false);
    setEditingChildId(null);
    setEditingChildLabel("");
    setEditingChildUrl("");
    setEditingChildIconFile(null);
    setEditingChildIconPreview(null);
    onClose();
  };

  const handleDeleteChild = async (childId: string, childLabel: string) => {
    if (!confirm(`Are you sure you want to delete "${childLabel}"?`)) return;

    try {
      const response = await fetch(`/api/links/children?id=${childId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to delete child link");
      }
    } catch (error) {
      console.error("Error deleting child link:", error);
      alert("Failed to delete child link");
    }
  };

  const handleEditChild = (child: {
    id: string;
    label: string;
    href: string;
    icon: string;
  }) => {
    setEditingChildId(child.id);
    setEditingChildLabel(child.label);
    setEditingChildUrl(child.href);
    setEditingChildIconPreview(child.icon);
  };

  const handleSaveChild = async () => {
    if (!editingChildId) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", editingChildId);
      formData.append("label", editingChildLabel.trim());
      formData.append("href", editingChildUrl.trim());

      if (editingChildIconFile) {
        formData.append("icon", editingChildIconFile);
      }

      const response = await fetch("/api/links/children", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update child link");
      }

      setEditingChildId(null);
      setEditingChildLabel("");
      setEditingChildUrl("");
      setEditingChildIconFile(null);
      setEditingChildIconPreview(null);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update child link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEditChild = () => {
    setEditingChildId(null);
    setEditingChildLabel("");
    setEditingChildUrl("");
    setEditingChildIconFile(null);
    setEditingChildIconPreview(null);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="bg-foreground/5 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl"
      sizeClass="max-w-2xl"
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
            onPaste={handleUrlPaste}
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

        {/* Child Links Management */}
        <div className="border-foreground/20 bg-foreground/5 mt-6 rounded-lg border-2 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              <Label className="mb-0">Child Links</Label>
              {children && children.length > 0 && (
                <span className="text-xs text-neutral-500">
                  ({children.length} {children.length === 1 ? "link" : "links"})
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsAddChildModalOpen(true)}
              disabled={isLoading || editingChildId !== null}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-500/20 px-3 py-1.5 text-xs text-blue-300 hover:bg-blue-500/30 disabled:opacity-50"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Child
            </button>
          </div>
          {children && children.length > 0 ? (
            <div className="border-foreground/20 space-y-2 border-l-2 pl-6">
              {children.map((child) => (
                <div key={child.id}>
                  {editingChildId === child.id ? (
                    <div className="space-y-3 rounded-lg border border-blue-500/30 bg-blue-500/5 p-3">
                      <div className="mb-2 text-xs font-medium text-blue-400">
                        Editing: {child.label}
                      </div>
                      <input
                        type="text"
                        value={editingChildLabel}
                        onChange={(e) => setEditingChildLabel(e.target.value)}
                        className="input text-sm"
                        placeholder="Label"
                      />
                      <input
                        type="url"
                        value={editingChildUrl}
                        onChange={(e) => setEditingChildUrl(e.target.value)}
                        className="input text-sm"
                        placeholder="URL"
                      />
                      <IconUploader
                        iconPreview={editingChildIconPreview}
                        setIconPreview={setEditingChildIconPreview}
                        setIconFile={setEditingChildIconFile}
                        fileInputRef={childFileInputRef}
                        disabled={isLoading}
                        currentIcon={child.icon}
                        id="child-icon"
                        onCustomIconSelected={() => {}}
                        isFetchingFavicon={false}
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleSaveChild}
                          disabled={isLoading}
                          className="flex-1 rounded-lg bg-blue-500/20 px-3 py-1.5 text-sm text-blue-300 hover:bg-blue-500/30 disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEditChild}
                          disabled={isLoading}
                          className="bg-foreground/10 hover:bg-foreground/20 flex-1 rounded-lg px-3 py-1.5 text-sm text-neutral-300 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-foreground/10 bg-foreground/5 hover:border-foreground/20 hover:bg-foreground/10 group flex items-center gap-2 rounded-lg border p-3 transition">
                      <div className="bg-foreground/10 flex h-6 w-6 items-center justify-center rounded">
                        <img
                          src={child.icon}
                          alt={child.label}
                          className="h-4 w-4"
                        />
                      </div>
                      <span className="flex-1 text-sm text-neutral-300">
                        {child.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleEditChild(child)}
                        disabled={isLoading || editingChildId !== null}
                        className="cursor-pointer rounded px-2 py-1 text-xs text-blue-300 hover:bg-blue-500/20 disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteChild(child.id, child.label)}
                        disabled={isLoading || editingChildId !== null}
                        className="cursor-pointer rounded px-2 py-1 text-xs text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center text-sm">
              No child links yet. Click &quot;Add Child&quot; to create one.
            </p>
          )}
        </div>

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

      <AddChildLinkModal
        isOpen={isAddChildModalOpen}
        onClose={() => setIsAddChildModalOpen(false)}
        parentId={linkId}
        parentLabel={currentLabel}
      />
    </Modal>
  );
}
