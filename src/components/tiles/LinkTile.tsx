"use client";

import { MenuPosition, calculateMenuPosition } from "@/lib/menuPositioning";

import AddChildLinkModal from "@/components/AddChildLinkModal";
import AnimatedBorder from "@/components/AnimatedBorder";
import EditLinkModal from "@/components/EditLinkModal";
import IconContextMenu from "@/components/IconContextMenu";
import Image from "next/image";
import React from "react";
import { createPortal } from "react-dom";
import { useLongPress } from "@/hooks/useLongPress";
import { useMenuStore } from "@/lib/stores/menuStore";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export enum IconType {
  Icon,
  List,
}

export type LinkItem = {
  id?: string;
  href?: string;
  label: string;
  icon: string;
  type?: IconType;
  children?: LinkItem[];
};

type Props = {
  link: LinkItem;
  draggable?: boolean;
};

export default function LinkTile({ link, draggable = false }: Props) {
  const isList =
    link.type === IconType.List && (link.children?.length ?? 0) > 0;

  // Generate a unique ID for this tile
  const tileId = React.useId();

  // dnd-kit sortable hook
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: link.id || link.label,
    disabled: !draggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Use centralized menu state
  const {
    openMenuId,
    openMenuType,
    isEditing,
    setOpenMenu,
    closeAllMenus,
    startEditing,
  } = useMenuStore();

  const [isAnimating, setIsAnimating] = React.useState(false);
  const [menuPosition, setMenuPosition] = React.useState<MenuPosition>({
    top: 0,
    left: 0,
    transform: "none",
  });
  const [isPositioned, setIsPositioned] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isAddChildModalOpen, setIsAddChildModalOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const tileRef = React.useRef<HTMLDivElement | null>(null);

  // Check if this tile's menus are open
  const isHoverMenuOpen = openMenuId === tileId && openMenuType === "hover";
  const isContextMenuOpen = openMenuId === tileId && openMenuType === "context";

  const longPress = useLongPress({
    onLongPress: () => {
      if (!isEditing) {
        setIsAnimating(false);
        setOpenMenu(tileId, "context");
      }
    },
    onStart: () => {
      if (!isEditing) {
        setIsAnimating(true);
      }
    },
    onCancel: () => {
      setIsAnimating(false);
    },
    threshold: 800,
  });

  const positionMenu = React.useCallback(() => {
    if (!menuRef.current || !tileRef.current) return;

    const triggerRect = tileRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();

    const calculatedPosition = calculateMenuPosition(
      triggerRect,
      288, // w-72 = 18rem = 288px
      menuRect.height || 200,
      16, // offset below trigger
    );

    setMenuPosition(calculatedPosition);
    setIsPositioned(true);
  }, []);

  React.useEffect(() => {
    if (!isHoverMenuOpen) {
      setIsPositioned(false);
      return;
    }

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
  }, [isHoverMenuOpen, positionMenu]);

  const handleAddChild = () => {
    setIsAddChildModalOpen(true);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const TileInner = (
    <>
      <AnimatedBorder isAnimating={isAnimating} duration={0.8} />

      <div className="size-18 bg-surface/50 z-[-1] min-h-16 min-w-16 rounded-xl backdrop-blur-2xl"></div>

      {/* Drag handle indicator when in edit mode */}
      {draggable && (
        <div className="absolute -right-1 -top-1 z-10 rounded-full bg-neutral-700 p-1">
          <svg
            className="h-3 w-3 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </div>
      )}

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

  const onMouseEnter = () => {
    if (!isContextMenuOpen && isList && !isEditing) {
      setOpenMenu(tileId, "hover");
    }
  };

  const onMouseLeave = () => {
    if (!isContextMenuOpen && openMenuType === "hover" && !isEditing) {
      closeAllMenus();
    }
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        tileRef.current = node;
      }}
      className={`group/tile relative flex select-none flex-col items-center ${draggable ? "jiggle cursor-move" : ""}`}
      style={style}
      {...(draggable ? { ...attributes, ...listeners } : {})}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={() =>
        !isContextMenuOpen &&
        isList &&
        !isEditing &&
        setOpenMenu(tileId, "hover")
      }
      onBlur={() =>
        !isContextMenuOpen &&
        openMenuType === "hover" &&
        !isEditing &&
        closeAllMenus()
      }
    >
      {isList &&
        isHoverMenuOpen &&
        !isContextMenuOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="bg-surface fixed z-[9999] w-72 rounded-xl p-1 shadow-lg"
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              transform: menuPosition.transform,
              opacity: isPositioned ? 1 : 0,
              transition: "opacity 0.15s",
            }}
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
          </div>,
          document.body,
        )}

      <IconContextMenu
        isOpen={isContextMenuOpen}
        onClose={() => {
          closeAllMenus();
        }}
        onEdit={handleEdit}
        onAddChild={handleAddChild}
        onEditOrder={startEditing}
        position={{ x: 0, y: 16 }}
        triggerRef={tileRef}
      />

      <EditLinkModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        linkId={link.id || ""}
        currentLabel={link.label}
        currentUrl={link.href || ""}
        currentIcon={link.icon}
      />

      <AddChildLinkModal
        isOpen={isAddChildModalOpen}
        onClose={() => setIsAddChildModalOpen(false)}
        parentId={link.id || ""}
        parentLabel={link.label}
      />

      {link.href ? (
        <a
          href={link.href}
          className="duration-1800 relative flex items-center drop-shadow-2xl transition-transform ease-out"
          style={{
            transform: isAnimating ? "scale(0.92)" : "scale(1)",
          }}
          {...longPress.handlers}
          onClick={(e) => {
            if (isContextMenuOpen) {
              e.preventDefault();
            }
          }}
        >
          {TileInner}
        </a>
      ) : (
        <div
          className="duration-1800 relative flex cursor-pointer items-center drop-shadow-2xl transition-transform ease-out"
          style={{
            transform: isAnimating ? "scale(0.92)" : "scale(1)",
          }}
          {...longPress.handlers}
          onClick={(e) => {
            e.preventDefault();
            // For folder icons without href, open context menu or hover menu
            if (isList && !isContextMenuOpen && !isEditing) {
              setOpenMenu(tileId, "hover");
            }
          }}
        >
          {TileInner}
        </div>
      )}
    </div>
  );
}
