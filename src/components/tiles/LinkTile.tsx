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
  const isList =
    link.type === IconType.List && (link.children?.length ?? 0) > 0;

  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  const positionMenu = React.useCallback(() => {
    const el = menuRef.current;
    if (!el) return;

    el.style.transform = "translate(0px, 0px)";
    const rect = el.getBoundingClientRect();
    const margin = 16;

    const overflowLeft = margin - rect.left;
    const overflowRight = rect.right - (window.innerWidth - margin);
    let deltaX = 0;
    if (overflowLeft > 0) deltaX = overflowLeft;
    else if (overflowRight > 0) deltaX = -overflowRight;

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

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        positionMenu();
      });
    });

    const handleResize = () => positionMenu();
    const handleScroll = () => positionMenu();

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

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
        className="size-18 text-surface group-hover/tile:text-surface-hover min-h-16 min-w-16 cursor-pointer select-none transition-all duration-100 ease-in-out active:scale-95 group-hover/tile:scale-105"
        aria-hidden="true"
      >
        <path d="M 0 80 C 0 0, 0 0, 80 0 S 160 0, 160 80, 160 160 80 160, 0 160, 0 80" />
      </svg>

      <Image
        src={link.icon}
        alt={link.label}
        width={32}
        height={32}
        className="pointer-events-none absolute left-1/2 size-9 -translate-x-1/2 select-none"
        draggable={false}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style={{ WebkitUserDrag: "none", WebkitTouchCallout: "none" } as any}
      />

      <span className="absolute left-1/2 top-[calc(100%+0.5rem)] line-clamp-2 w-20 -translate-x-1/2 select-none text-balance text-center text-xs font-medium text-neutral-400 transition-colors group-hover/tile:text-neutral-200">
        {link.label}
      </span>
    </>
  );

  const onMouseEnter = () => setOpen(true);
  const onMouseLeave = () => setOpen(false);

  return (
    <div
      className="group/tile relative flex flex-col items-center"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {isList && open && (
        <div className="absolute left-0 top-[calc(100%+1rem)] hidden md:block">
          <div
            ref={menuRef}
            className="bg-surface relative z-[100] w-72 rounded-xl p-1 shadow-lg will-change-transform"
            style={{ transform: "translate(0px, 0px)" }}
          >
            {link.children!.map((child) => (
              <a
                key={child.label}
                href={child.href}
                className="group/item hover:bg-surface-hover flex items-center rounded-lg px-2.5 py-2.5 transition active:scale-95"
              >
                <Image
                  src={child.icon}
                  alt={child.label}
                  width={24}
                  height={24}
                  className="pointer-events-none ml-0.5 mr-3 size-4"
                  draggable={false}
                />
                <span className="text-sm text-neutral-300 transition-colors group-hover/item:text-white">
                  {child.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      <a
        href={link.href}
        className="relative hidden items-center drop-shadow-2xl md:flex"
      >
        {TileInner}
      </a>
    </div>
  );
}
