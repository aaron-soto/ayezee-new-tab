"use client";

import { AnimatePresence, motion } from "framer-motion";

import React from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  // additional classes applied to the inner modal panel
  className?: string;
  // max width class (e.g. max-w-md)
  sizeClass?: string;
};

export default function Modal({
  isOpen,
  onClose,
  children,
  className = "",
  sizeClass = "max-w-md",
}: ModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] bg-transparent"
        />

        {/* Modal panel container */}
        <div
          className="bg-surface/70 rounded-2xl! fixed inset-0 z-[10001] flex items-center justify-center p-4 shadow-2xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className={`${sizeClass} w-full ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </div>
      </>
    </AnimatePresence>,
    document.body,
  );
}

type ModalButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: React.ReactNode;
  className?: string;
};

export const ModalCancel: React.FC<ModalButtonProps> = ({
  label = "Cancel",
  // match existing modal cancel button styles by default
  className = "flex-1",
  ...rest
}) => {
  return (
    <button
      type="button"
      className={`button bg-foreground/5! text-muted-foreground! hover:text-foreground! backdrop-blur-2xl ${className}`}
      {...rest}
    >
      {label}
    </button>
  );
};

export const ModalConfirm: React.FC<ModalButtonProps> = ({
  label = "Confirm",
  // match existing modal confirm button styles by default
  className = "flex-1",
  ...rest
}) => {
  // default to submit when used inside forms unless overridden
  const restProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  const { type = "submit", ...props } = restProps;
  return (
    <button
      type={type}
      className={`button bg-foreground/50! text-foreground! hover:text-foreground! hover:bg-foreground/60! backdrop-blur-2xl ${className}`}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {label}
    </button>
  );
};
