"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MenuPosition, calculateMenuPosition } from "@/lib/menuPositioning";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({
    top: 0,
    left: 0,
    transform: "none",
  });
  const [isPositioned, setIsPositioned] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIsPositioned(false);
      return;
    }

    if (!buttonRef.current || !menuRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();

    const calculatedPosition = calculateMenuPosition(
      buttonRect,
      228,
      menuRect.height || 120,
      8, // Small offset
    );

    setMenuPosition(calculatedPosition);
    setIsPositioned(true);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  if (!session?.user) return null;

  const userImage = session.user.image || "";
  const userName = session.user.name || session.user.email || "User";

  const menu = mounted ? (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isPositioned ? 1 : 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "bg-surface/50 fixed z-[9999] rounded-xl p-1 shadow-lg backdrop-blur-2xl",
            `w-[220px]`,
          )}
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
            transform: menuPosition.transform,
          }}
        >
          {/* User Info */}
          <div className="border-b border-neutral-700 px-3 py-2.5">
            <p className="truncate text-sm font-medium text-white">
              {userName}
            </p>
            <p className="truncate text-xs text-neutral-400">
              {session.user.email}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/settings");
              }}
              className="group/item hover:bg-surface-hover flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-left transition active:scale-95"
            >
              <svg
                className="mr-3 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-sm text-neutral-300 transition-colors group-hover/item:text-white">
                Settings
              </span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: "/login" });
              }}
              className="group/item hover:bg-surface-hover flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-left transition active:scale-95"
            >
              <svg
                className="mr-3 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="text-sm text-neutral-300 transition-colors group-hover/item:text-white">
                Sign Out
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  ) : null;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex size-12 cursor-pointer items-center justify-center overflow-hidden rounded-full transition-all hover:ring-2 hover:ring-neutral-600 active:scale-95"
        aria-label="User menu"
      >
        {userImage ? (
          <Image
            src={userImage}
            alt={userName}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-700 text-sm font-medium text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {mounted && createPortal(menu, document.body)}
    </>
  );
}
