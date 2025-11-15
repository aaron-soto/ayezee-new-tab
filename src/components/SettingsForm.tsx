"use client";

import Image from "next/image";
import Label from "@/components/Label";
import SortToggle from "@/components/SortToggle";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface SettingsFormProps {
  user: User;
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [imageUrl, setImageUrl] = useState(user.image || "");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          image: imageUrl.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });

      // Refresh the page to update session data
      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to update profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Image Preview */}
      <div className="flex flex-col items-center">
        <div className="mb-4 size-24 overflow-hidden rounded-full">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name || "User"}
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-700 text-2xl font-medium text-white">
              {name ? name.charAt(0).toUpperCase() : "?"}
            </div>
          )}
        </div>
        <p className="text-sm text-neutral-400">{user.email}</p>
      </div>

      {/* Name Input */}
      <div>
        <Label htmlFor="name">Display Name</Label>

        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          placeholder="Enter your name"
        />
      </div>

      {/* Image URL Input */}
      <div>
        <Label htmlFor="imageUrl">Profile Image URL</Label>

        <input
          type="url"
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="input"
          placeholder="https://example.com/image.jpg"
        />
        <p className="mt-1 text-xs text-neutral-500">
          Enter a direct URL to an image
        </p>
      </div>

      {/* Sort Order Preference */}
      <div>
        <Label htmlFor="sortToggle">Link Sort Order</Label>
        <div className="mt-2">
          <SortToggle />
        </div>
        <p className="mt-1 text-xs text-neutral-500">
          Choose how to sort your links on the home page
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-green-900/20 text-green-400"
              : "bg-red-900/20 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Submit Button */}
      <button type="submit" disabled={isLoading} className="button w-full">
        {isLoading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
