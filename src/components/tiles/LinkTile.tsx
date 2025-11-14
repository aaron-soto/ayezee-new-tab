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
import DragHandleIcon from "@/components/icons/DragHandleIcon";

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
    scale: isDragging ? 1.05 : 1,
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
  const closeTimeoutRef = React.useRef<number | null>(null);

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
      8, // offset below trigger
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

  // Visual content is wrapped in an inner element so we can animate
  // rotation without affecting the outer wrapper's layout/size.
  const Visual = (
    <div
      className={`relative flex h-full w-full items-center justify-center ${
        draggable ? "jiggle-inner" : ""
      }`}
      // ensure the visual area fills the tile wrapper
    >
      <AnimatedBorder isAnimating={isAnimating} duration={0.8} />

      {/* background box: use a valid hover class and keep z non-negative so it's visible */}
      <div className="size-18 bg-foreground/5 hover:bg-foreground/10 z-0 min-h-16 min-w-16 rounded-xl backdrop-blur-2xl"></div>

      {/* Drag handle indicator when in edit mode (absolute so it doesn't affect layout) */}
      {draggable && (
        <div className="pointer-events-auto absolute -right-1 -top-1 z-10 rounded-full bg-neutral-600 p-1">
          <DragHandleIcon />
        </div>
      )}

      <Image
        src={link.icon}
        alt={link.label}
        width={32}
        height={32}
        // explicitly center the icon both horizontally and vertically inside the visual
        // use the same named group as the outer wrapper (group/tile) so hovering
        // the tile triggers the scale; add transition utilities for smoothness
        className="pointer-events-none absolute left-1/2 top-1/2 size-9 -translate-x-1/2 -translate-y-1/2 select-none transition-transform duration-150"
        draggable={false}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style={{ WebkitUserDrag: "none", WebkitTouchCallout: "none" } as any}
      />
    </div>
  );

  const onMouseEnter = () => {
    // If a close timeout is pending (user moving between tile and menu), clear it
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    if (!isContextMenuOpen && isList && !isEditing) {
      setOpenMenu(tileId, "hover");
    }
  };

  const onMouseLeave = () => {
    // Start a short timeout before closing so mouse movement to the portal menu
    // doesn't immediately close it when the cursor briefly leaves the tile.
    if (!isContextMenuOpen && openMenuType === "hover" && !isEditing) {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = window.setTimeout(() => {
        // Only close if the menu still belongs to this tile when the timeout fires
        if (openMenuId === tileId) {
          closeAllMenus();
        }
        closeTimeoutRef.current = null;
      }, 180);
    }
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        tileRef.current = node;
      }}
      // give the tile a fixed height so the jiggle rotation doesn't change
      // the layout/row height when tiles are animated or dragged
      className={`group/tile relative flex h-24 select-none flex-col items-center ${
        draggable ? "cursor-move" : ""
      }`}
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
            className="bg-foreground/5 fixed z-[9999] w-72 rounded-xl p-1 shadow-lg backdrop-blur-2xl"
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              transform: menuPosition.transform,
              opacity: isPositioned ? 1 : 0,
              transition: "opacity 0.15s",
            }}
            onMouseEnter={() => {
              // cancel pending close when the user moves into the menu
              if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
                closeTimeoutRef.current = null;
              }
            }}
            onMouseLeave={() => {
              // start the same short timeout when leaving the menu
              if (closeTimeoutRef.current)
                clearTimeout(closeTimeoutRef.current);
              closeTimeoutRef.current = window.setTimeout(() => {
                // Only close if the menu still belongs to this tile when the timeout fires
                if (openMenuId === tileId) {
                  closeAllMenus();
                }
                closeTimeoutRef.current = null;
              }, 180);
            }}
          >
            {link.children!.map((child) => (
              <a
                key={child.label}
                href={child.href}
                className="group/item hover:bg-foreground/10 flex items-center rounded-lg bg-transparent px-2.5 py-2.5 transition active:scale-95"
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

      {link.href && !isEditing ? (
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
          {Visual}

          <span className="absolute left-1/2 top-[calc(100%+0.5rem)] line-clamp-2 w-20 -translate-x-1/2 select-none text-balance text-center text-xs font-medium text-neutral-400 transition-colors group-hover/tile:text-neutral-200">
            {link.label}
          </span>
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
          {Visual}

          <span className="absolute left-1/2 top-[calc(100%+0.5rem)] line-clamp-2 w-20 -translate-x-1/2 select-none text-balance text-center text-xs font-medium text-neutral-400 transition-colors group-hover/tile:text-neutral-200">
            {link.label}
          </span>
        </div>
      )}
    </div>
  );
}
