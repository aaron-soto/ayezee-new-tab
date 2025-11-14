"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MenuPosition, calculateMenuPosition } from "@/lib/menuPositioning";
import { useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";

interface ContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onAddChild?: () => void;
  onEditOrder?: () => void;
  onDelete?: () => void;
  position?: { x: number; y: number };
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export default function IconContextMenu({
  isOpen,
  onClose,
  onEdit,
  onAddChild,
  onEditOrder,
  onDelete,
  position,
  triggerRef,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({
    top: 0,
    left: 0,
    transform: "none",
  });
  const [isPositioned, setIsPositioned] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIsPositioned(false);
      return;
    }

    if (!triggerRef?.current || !menuRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();

    const calculatedPosition = calculateMenuPosition(
      triggerRect,
      192, // w-48 = 12rem = 192px
      menuRect.height || 100, // Use actual height or estimate
      position?.y ?? 16,
    );

    setMenuPosition(calculatedPosition);
    setIsPositioned(true);
  }, [isOpen, position, triggerRef]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const menu = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isPositioned ? 1 : 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          className="bg-foreground/5 fixed z-[9999] w-48 rounded-xl p-1 shadow-lg backdrop-blur-2xl"
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
            transform: menuPosition.transform,
          }}
        >
          {onEdit && (
            <button
              onClick={() => {
                onEdit();
                onClose();
              }}
              className="group/item hover:bg-foreground/10 flex w-full cursor-pointer items-center rounded-lg px-2.5 py-2.5 text-left transition active:scale-95"
            >
              <svg
                className="ml-0.5 mr-3 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span className="text-sm text-neutral-300 transition-colors group-hover/item:text-white">
                Edit Link
              </span>
            </button>
          )}
          {onAddChild && (
            <button
              onClick={() => {
                onAddChild();
                onClose();
              }}
              className="group/item hover:bg-foreground/10 flex w-full cursor-pointer items-center rounded-lg px-2.5 py-2.5 text-left transition active:scale-95"
            >
              <svg
                className="ml-0.5 mr-3 h-4 w-4"
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
              <span className="text-sm text-neutral-300 transition-colors group-hover/item:text-white">
                Add Child Link
              </span>
            </button>
          )}
          {onEditOrder && (
            <button
              onClick={() => {
                onEditOrder();
                onClose();
              }}
              className="group/item hover:bg-foreground/10 flex w-full cursor-pointer items-center rounded-lg px-2.5 py-2.5 text-left transition active:scale-95"
            >
              <svg
                className="ml-0.5 mr-3 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <span className="text-sm text-neutral-300 transition-colors group-hover/item:text-white">
                Edit Order
              </span>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="group/item flex w-full cursor-pointer items-center rounded-lg px-2.5 py-2.5 text-left transition hover:bg-red-500/10 active:scale-95"
            >
              <svg
                className="ml-0.5 mr-3 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span className="text-sm text-red-400 transition-colors group-hover/item:text-red-300">
                Delete
              </span>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(menu, document.body);
}
