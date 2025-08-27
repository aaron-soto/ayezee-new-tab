"use client";

import Image from "next/image";
import React from "react";

export enum IconType {
  Icon,
  List,
}
export type LinkItem = {
  href?: string;
  label: string;
  icon: string;
  type?: IconType;
  children?: LinkItem[];
};

type Props = { link: LinkItem };

const LONG_PRESS_MS = 350;

export default function LinkTile({ link }: Props) {
  const isList = link.type === IconType.List && (link.children?.length ?? 0) > 0;

  const [open, setOpen] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState<number | null>(null);
  const pressTimerRef = React.useRef<number | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef<HTMLAnchorElement[]>([]);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.touchAction;
    document.body.style.touchAction = "none";
    return () => {
      document.body.style.touchAction = prev;
    };
  }, [open]);

  const clearPressTimer = () => {
    if (pressTimerRef.current) {
      window.clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const handlePointerDown: React.PointerEventHandler = (e) => {
    if (!isList) return;
    if (e.pointerType !== "touch") return;
    // stop iOS link/image drag behavior
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);

    clearPressTimer();
    pressTimerRef.current = window.setTimeout(() => {
      setOpen(true);
      setActiveIdx(null);
      if (navigator.vibrate) navigator.vibrate(10);
    }, LONG_PRESS_MS);
  };

  const handlePointerMove: React.PointerEventHandler = (e) => {
    if (!open && pressTimerRef.current) {
      if (Math.abs(e.movementX) + Math.abs(e.movementY) > 10) clearPressTimer();
      return;
    }
    if (!open || !menuRef.current) return;

    const { clientX, clientY } = e;
    let found: number | null = null;
    for (let i = 0; i < itemRefs.current.length; i++) {
      const el = itemRefs.current[i];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) {
        found = i;
        break;
      }
    }
    if (activeIdx !== found) {
      setActiveIdx(found);
      if (navigator.vibrate) navigator.vibrate(5);
    }
  };

  const handlePointerUp: React.PointerEventHandler = () => {
    clearPressTimer();
    if (!open) return;
    const idx = activeIdx ?? -1;
    const chosen = idx >= 0 ? link.children?.[idx] : undefined;
    setOpen(false);
    setActiveIdx(null);
    if (chosen?.href) window.location.assign(chosen.href);
  };

  const handlePointerCancel: React.PointerEventHandler = () => {
    clearPressTimer();
    setOpen(false);
    setActiveIdx(null);
  };

  const TileInner = (
    <>
      <svg
        viewBox="0 0 160 160"
        fill="currentColor"
        className="transition-all duration-100 ease-in-out cursor-pointer select-none size-16 min-h-16 min-w-16 text-neutral-800 active:scale-95 group-hover:scale-105 group-hover:text-neutral-700"
        aria-hidden="true"
      >
        <path d="M 0 80 C 0 0, 0 0, 80 0 S 160 0, 160 80, 160 160 80 160, 0 160, 0 80" />
      </svg>
      <Image
        src={link.icon}
        alt={link.label}
        width={32}
        height={32}
        className="absolute -translate-x-1/2 pointer-events-none select-none left-1/2 size-8 group-hover:scale-105"
        draggable={false}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style={{ WebkitUserDrag: "none", WebkitTouchCallout: "none" } as any}
      />
      <span className="absolute text-sm font-medium -translate-x-1/2 select-none left-1/2 -bottom-6 text-nowrap">
        {link.label}
      </span>
    </>
  );

  return (
    <div className="relative flex flex-col items-center group">
      {/* Desktop hover menu */}
      {isList && (
        <div className="absolute left-4 top-[calc(100%+1rem)] hidden md:group-hover:block md:group-focus-within:block">
          <div className="relative z-[100] w-72 rounded-lg bg-neutral-800 p-2 shadow-lg">
            {link.children!.map((child) => (
              <a
                key={child.label}
                href={child.href}
                className="flex items-center px-2 py-2 rounded-md hover:bg-neutral-700 active:scale-95"
              >
                <Image
                  src={child.icon}
                  alt={child.label}
                  width={24}
                  height={24}
                  className="mr-2 pointer-events-none"
                  draggable={false}
                />
                <span className="text-sm font-medium">{child.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Main tile:
         - List: button on touch (no native link), but keep anchor for desktop click/hover
         - Single link: normal anchor
      */}
      {isList ? (
        // For lists, render BOTH: a button (touch) layered over an anchor (desktop)
        <div className="relative">
          {/* Desktop clickable anchor under the hood */}
          <a href={link.href} className="relative flex items-center hidden drop-shadow-2xl md:flex">
            {TileInner}
          </a>

          {/* Touch button overlay (prevents iOS drag) */}
          <button
            type="button"
            className="relative flex items-center drop-shadow-2xl md:hidden [touch-action:none] select-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onContextMenu={(e) => e.preventDefault()}
          >
            {TileInner}
          </button>
        </div>
      ) : (
        <a
          href={link.href}
          className="relative flex items-center group drop-shadow-2xl"
          // still disable native drag to avoid accidental drags
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        >
          {TileInner}
        </a>
      )}

      {/* Mobile drag-select menu */}
      {isList && open && (
        <div
          ref={menuRef}
          className="absolute left-4 top-[calc(100%+1rem)] w-72 rounded-lg bg-neutral-800 p-2 shadow-lg md:hidden [touch-action:none]"
          onContextMenu={(e) => e.preventDefault()}
        >
          {link.children!.map((child, i) => (
            <a
              key={child.label}
              ref={(el) => {
                if (el) itemRefs.current[i] = el;
              }}
              href={child.href}
              className={[
                "flex items-center rounded-md px-2 py-2",
                activeIdx === i ? "bg-neutral-700" : "bg-transparent",
              ].join(" ")}
              onClick={(e) => {
                if (!open) return;
                e.preventDefault();
              }}
              draggable={false}
            >
              <Image
                src={child.icon}
                alt={child.label}
                width={24}
                height={24}
                className="mr-2 pointer-events-none"
                draggable={false}
              />
              <span className="text-sm font-medium select-none">{child.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
