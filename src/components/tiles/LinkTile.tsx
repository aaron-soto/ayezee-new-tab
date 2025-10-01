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

export default function LinkTile({ link }: Props) {
  const isList = link.type === IconType.List && (link.children?.length ?? 0) > 0;

  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  const positionMenu = React.useCallback(() => {
    const el = menuRef.current;
    if (!el) return;

    // Reset transform before measuring
    el.style.transform = "translate(0px, 0px)";

    const rect = el.getBoundingClientRect();
    const margin = 16; // 1rem

    const overflowLeft = margin - rect.left; // positive => needs to move right
    const overflowRight = rect.right - (window.innerWidth - margin); // positive => needs to move left

    let deltaX = 0;
    if (overflowLeft > 0) deltaX = overflowLeft;
    else if (overflowRight > 0) deltaX = -overflowRight;

    // Optional vertical correction (kept minimal; adjust if needed)
    const overflowTop = margin - rect.top;
    const overflowBottom = rect.bottom - (window.innerHeight - margin);
    let deltaY = 0;
    if (overflowTop > 0) deltaY = overflowTop;
    else if (overflowBottom > 0) deltaY = -overflowBottom;

    el.style.transform = `translate(${Math.round(deltaX)}px, ${Math.round(deltaY)}px)`;
  }, []);

  React.useEffect(() => {
    if (!open) return;

    let raf1 = 0;
    let raf2 = 0;

    // Wait for the flyout to render, then measure on the next frame
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        positionMenu();
      });
    });

    const handleResize = () => positionMenu();
    const handleScroll = () => positionMenu();

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // React to internal content size changes too
    const el = menuRef.current;
    const ro = el ? new ResizeObserver(() => positionMenu()) : null;
    if (el && ro) ro.observe(el);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      if (el && ro) ro.disconnect();
    };
  }, [open, positionMenu]);

  const TileInner = (
    <>
      <svg
        viewBox="0 0 160 160"
        fill="currentColor"
        className="transition-all duration-100 ease-in-out cursor-pointer select-none size-18 min-h-16 min-w-16 text-neutral-800 active:scale-95 group-hover:scale-105 group-hover:text-neutral-700"
        aria-hidden="true"
      >
        <path d="M 0 80 C 0 0, 0 0, 80 0 S 160 0, 160 80, 160 160 80 160, 0 160, 0 80" />
      </svg>
      <Image
        src={link.icon}
        alt={link.label}
        width={32}
        height={32}
        className="absolute -translate-x-1/2 pointer-events-none select-none left-1/2 size-9"
        draggable={false}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style={{ WebkitUserDrag: "none", WebkitTouchCallout: "none" } as any}
      />
      <span className="absolute w-20 text-xs font-medium text-neutral-400 group-hover:text-neutral-200 transition-colors text-center -translate-x-1/2 select-none left-1/2 top-[calc(100%+0.5rem)] text-balance line-clamp-2">
        {link.label}
      </span>
    </>
  );

  const onMouseEnter = () => {
    setOpen(true);
  };

  const onMouseLeave = () => {
    setOpen(false);
  };

  return (
    <div
      className="relative flex flex-col items-center group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {isList && open && (
        <div className="absolute left-0 top-[calc(100%+1rem)] hidden md:block">
          <div
            ref={menuRef}
            className="relative z-[100] w-72 rounded-xl bg-neutral-800 p-1 shadow-lg will-change-transform"
            style={{ transform: "translate(0px, 0px)" }}
          >
            {link.children!.map((child) => (
              <a
                key={child.label}
                href={child.href}
                className="flex items-center px-2.5 py-2.5 rounded-lg hover:bg-neutral-700/60 active:scale-95"
              >
                <Image
                  src={child.icon}
                  alt={child.label}
                  width={24}
                  height={24}
                  className="ml-0.5 mr-3 pointer-events-none size-4"
                  draggable={false}
                />
                <span className="text-sm text-neutral-300">{child.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      <a href={link.href} className="relative items-center hidden drop-shadow-2xl md:flex">
        {TileInner}
      </a>
    </div>
  );
}
