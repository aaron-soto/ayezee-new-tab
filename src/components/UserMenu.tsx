"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MenuPosition, calculateMenuPosition } from "@/lib/menuPositioning";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import SettingsIcon from "@/components/icons/SettingsIcon";
import SignOutIcon from "@/components/icons/SignOutIcon";
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
            "bg-foreground/5 fixed z-[9999] rounded-xl p-1 shadow-lg backdrop-blur-2xl",
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
              className="group/item hover:bg-foreground/10 flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-left transition active:scale-95"
            >
              <SettingsIcon className="mr-3 size-5" />

              <span className="text-sm text-neutral-300 transition-colors group-hover/item:text-white">
                Settings
              </span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: "/login" });
              }}
              className="group/item hover:bg-foreground/10 flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-left transition active:scale-95"
            >
              <SignOutIcon className="mr-3 size-5" />

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
