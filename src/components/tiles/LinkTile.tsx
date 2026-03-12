"use client";

import { MenuPosition, calculateMenuPosition } from "@/lib/menuPositioning";

import AddChildLinkModal from "@/components/AddChildLinkModal";
import { CSS } from "@dnd-kit/utilities";
import ChildLink from "@/components/tiles/ChildLink";
import DragHandleIcon from "@/components/icons/DragHandleIcon";
import EditChildLinkModal from "@/components/EditChildLinkModal";
import EditLinkModal from "@/components/EditLinkModal";
import IconContextMenu from "@/components/IconContextMenu";
import Image from "next/image";
import React from "react";
import { useMenuStore } from "@/lib/stores/menuStore";
import { useRouter } from "next/navigation";
import { useSortable } from "@dnd-kit/sortable";

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
  visitCount?: number;
  gridRow?: number | null;
  gridColumn?: number | null;
  children?: LinkItem[];
};

type Props = {
  link: LinkItem;
  draggable?: boolean;
  linkId?: string;
};

export default function LinkTile({ link, draggable = false, linkId }: Props) {
  const router = useRouter();
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
    transition: {
      duration: 350,
      easing: "cubic-bezier(0.25, 0.8, 0.25, 1)",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging
      ? undefined
      : transition || "transform 350ms cubic-bezier(0.25, 0.8, 0.25, 1)",
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

  const [menuPosition, setMenuPosition] = React.useState<MenuPosition>({
    top: 0,
    left: 0,
    transform: "none",
  });
  const [isPositioned, setIsPositioned] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isAddChildModalOpen, setIsAddChildModalOpen] = React.useState(false);
  const [isEditChildModalOpen, setIsEditChildModalOpen] = React.useState(false);
  const [isReorderingChildren, setIsReorderingChildren] = React.useState(false);
  const [reorderedChildren, setReorderedChildren] = React.useState<LinkItem[]>(
    link.children || [],
  );
  const [editingChild, setEditingChild] = React.useState<{
    id: string;
    label: string;
    href: string;
    icon: string;
  } | null>(null);
  const [childContextMenu, setChildContextMenu] = React.useState<{
    childId: string;
    childLabel: string;
    childHref: string;
    childIcon: string;
    element: HTMLAnchorElement;
  } | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const tileRef = React.useRef<HTMLDivElement | null>(null);
  const childMenuTriggerRef = React.useRef<HTMLAnchorElement | null>(null);
  const closeTimeoutRef = React.useRef<number | null>(null);

  // Memoize position object to prevent infinite re-renders
  const contextMenuPosition = React.useMemo(() => ({ x: 0, y: 0 }), []);

  // Check if this tile's menus are open
  const isHoverMenuOpen = openMenuId === tileId && openMenuType === "hover";
  const isContextMenuOpen = openMenuId === tileId && openMenuType === "context";

  // Keep hover menu open if child context menu is active
  const shouldShowHoverMenu =
    isHoverMenuOpen || !!childContextMenu || isReorderingChildren;

  // Clear any pending close timeout when ANY menu opens (not just this tile's)
  React.useEffect(() => {
    if (openMenuType === "hover" && closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, [openMenuId, openMenuType]);

  // Clear timeout on unmount
  React.useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Update reorderedChildren when link.children changes
  React.useEffect(() => {
    if (link.children) {
      setReorderedChildren(link.children);
    }
  }, [link.children]);

  const positionMenu = React.useCallback(() => {
    if (!menuRef.current || !tileRef.current) return;

    const triggerRect = tileRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();

    const calculatedPosition = calculateMenuPosition(
      triggerRect,
      288, // w-72 = 18rem = 288px
      menuRect.height || 200,
      0, // offset below trigger
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

  const handleDelete = async () => {
    if (!link.id) return;

    if (confirm(`Are you sure you want to delete "${link.label}"?`)) {
      try {
        const response = await fetch(`/api/links?id=${link.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          router.refresh();
        } else {
          alert("Failed to delete link");
        }
      } catch (error) {
        console.error("Error deleting link:", error);
        alert("Failed to delete link");
      }
    }
  };

  const handleDeleteChild = async (childId: string, childLabel: string) => {
    if (confirm(`Are you sure you want to delete "${childLabel}"?`)) {
      try {
        const response = await fetch(`/api/links/children?id=${childId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          router.refresh();
        } else {
          alert("Failed to delete child link");
        }
      } catch (error) {
        console.error("Error deleting child link:", error);
        alert("Failed to delete child link");
      }
    }
    setChildContextMenu(null);
  };

  const handleEditChild = (child: {
    id: string;
    label: string;
    href: string;
    icon: string;
  }) => {
    setEditingChild(child);
    setIsEditChildModalOpen(true);
    setChildContextMenu(null);
  };

  const handleReorderChildren = () => {
    setIsReorderingChildren(true);
    setChildContextMenu(null);
    closeAllMenus();
  };

  const handleSaveChildrenOrder = async () => {
    try {
      const childIds = reorderedChildren.map((child) => child.id!);
      const response = await fetch("/api/links/children/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentId: link.id, childIds }),
      });

      if (response.ok) {
        setIsReorderingChildren(false);
        router.refresh();
      } else {
        alert("Failed to reorder children");
      }
    } catch (error) {
      console.error("Error reordering children:", error);
      alert("Failed to reorder children");
    }
  };

  const handleCancelChildrenReorder = () => {
    setReorderedChildren(link.children || []);
    setIsReorderingChildren(false);
  };

  const moveChild = (fromIndex: number, toIndex: number) => {
    const newChildren = [...reorderedChildren];
    const [movedChild] = newChildren.splice(fromIndex, 1);
    newChildren.splice(toIndex, 0, movedChild);
    setReorderedChildren(newChildren);
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

    if (!isContextMenuOpen && isList && !isEditing && !childContextMenu) {
      setOpenMenu(tileId, "hover");
    }
  };

  const onMouseLeave = () => {
    // Don't close hover menu if child context menu is open
    if (childContextMenu) return;

    // Start a short timeout before closing so mouse movement to the portal menu
    // doesn't immediately close it when the cursor briefly leaves the tile.
    if (!isContextMenuOpen && openMenuType === "hover" && !isEditing) {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = window.setTimeout(() => {
        // Double-check child context menu isn't open before closing
        if (childContextMenu) return;

        // Only close if the menu still belongs to this tile when the timeout fires
        if (openMenuId === tileId && openMenuType === "hover") {
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
      data-link-id={linkId}
      // give the tile a fixed height so the jiggle rotation doesn't change
      // the layout/row height when tiles are animated or dragged
      className={`group/tile relative flex h-24 select-none flex-col items-center ${
        draggable ? "cursor-move" : ""
      }`}
      style={style}
      {...(draggable ? { ...attributes, ...listeners } : {})}
      onMouseEnter={!draggable ? onMouseEnter : undefined}
      onMouseLeave={!draggable ? onMouseLeave : undefined}
      onFocus={
        !draggable
          ? () =>
              !isContextMenuOpen &&
              isList &&
              !isEditing &&
              setOpenMenu(tileId, "hover")
          : undefined
      }
      onBlur={
        !draggable
          ? () =>
              !isContextMenuOpen &&
              openMenuType === "hover" &&
              !isEditing &&
              closeAllMenus()
          : undefined
      }
    >
      {isList && shouldShowHoverMenu && !isContextMenuOpen && (
        <div
          ref={menuRef}
          className="bg-foreground/5 fixed z-[9999] w-72 rounded-xl p-1 shadow-lg backdrop-blur-2xl"
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
            transform: menuPosition.transform,
            opacity: isPositioned ? 1 : 0,
            transition: "opacity 0.15s",
            pointerEvents: isPositioned ? "auto" : "none",
          }}
          onMouseEnter={() => {
            // cancel pending close when the user moves into the menu
            if (closeTimeoutRef.current) {
              clearTimeout(closeTimeoutRef.current);
              closeTimeoutRef.current = null;
            }
          }}
          onMouseLeave={() => {
            // Don't close hover menu if child context menu is open or reordering
            if (childContextMenu || isReorderingChildren) return;

            // start the same short timeout when leaving the menu
            if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = window.setTimeout(() => {
              // Only close if the menu still belongs to this tile when the timeout fires
              if (openMenuId === tileId && openMenuType === "hover") {
                closeAllMenus();
              }
              closeTimeoutRef.current = null;
            }, 180);
          }}
        >
          {isReorderingChildren ? (
            <>
              {reorderedChildren.map((child, index) => (
                <div
                  key={child.id || child.label}
                  className="group/item hover:bg-foreground/10 relative flex items-center overflow-hidden rounded-lg bg-transparent px-2.5 py-2.5 transition"
                >
                  <Image
                    src={child.icon}
                    alt={child.label}
                    width={24}
                    height={24}
                    className="pointer-events-none relative z-10 ml-0.5 mr-3 size-4"
                    draggable={false}
                  />
                  <span className="relative z-10 flex-1 text-sm text-neutral-300 transition-colors group-hover/item:text-white">
                    {child.label}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveChild(index, Math.max(0, index - 1))}
                      disabled={index === 0}
                      className="hover:bg-foreground/10 rounded p-1 disabled:opacity-30"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        moveChild(
                          index,
                          Math.min(reorderedChildren.length - 1, index + 1),
                        )
                      }
                      disabled={index === reorderedChildren.length - 1}
                      className="hover:bg-foreground/10 rounded p-1 disabled:opacity-30"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              <div className="border-foreground/10 mt-2 flex gap-2 border-t pt-2">
                <button
                  onClick={handleSaveChildrenOrder}
                  className="flex-1 rounded-lg bg-blue-500/20 px-3 py-2 text-sm text-blue-300 hover:bg-blue-500/30"
                >
                  Save Order
                </button>
                <button
                  onClick={handleCancelChildrenReorder}
                  className="bg-foreground/10 hover:bg-foreground/20 flex-1 rounded-lg px-3 py-2 text-sm text-neutral-300"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            (link.children || []).map((child) => (
              <ChildLink
                key={child.id || child.label}
                child={child}
                onLongPress={(childId, childLabel, element) => {
                  // Clear any pending close timeout to keep hover menu open
                  if (closeTimeoutRef.current) {
                    clearTimeout(closeTimeoutRef.current);
                    closeTimeoutRef.current = null;
                  }

                  // Keep the hover menu explicitly open while showing child context menu
                  setOpenMenu(tileId, "hover");

                  childMenuTriggerRef.current = element;
                  const childData = link.children?.find(
                    (c) => c.id === childId,
                  );
                  setChildContextMenu({
                    childId,
                    childLabel,
                    childHref: childData?.href || "",
                    childIcon: childData?.icon || "",
                    element,
                  });
                }}
                isContextMenuOpen={childContextMenu?.childId === child.id}
              />
            ))
          )}
        </div>
      )}

      <IconContextMenu
        isOpen={isContextMenuOpen}
        onClose={() => {
          closeAllMenus();
        }}
        onEdit={handleEdit}
        onAddChild={handleAddChild}
        onEditOrder={startEditing}
        onDelete={handleDelete}
        position={contextMenuPosition}
        triggerRef={tileRef}
      />

      {childContextMenu && (
        <IconContextMenu
          key={childContextMenu.childId}
          isOpen={!!childContextMenu}
          onClose={() => {
            setChildContextMenu(null);
            // Restore hover menu after closing child context menu
            if (isList && !isEditing) {
              setOpenMenu(tileId, "hover");
            }
          }}
          onEdit={() =>
            handleEditChild({
              id: childContextMenu.childId,
              label: childContextMenu.childLabel,
              href: childContextMenu.childHref,
              icon: childContextMenu.childIcon,
            })
          }
          onEditOrder={
            (link.children?.length ?? 0) > 1 ? handleReorderChildren : undefined
          }
          onDelete={() =>
            handleDeleteChild(
              childContextMenu.childId,
              childContextMenu.childLabel,
            )
          }
          position={contextMenuPosition}
          triggerRef={childMenuTriggerRef}
          zIndex={10000}
        />
      )}

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

      <EditChildLinkModal
        isOpen={isEditChildModalOpen}
        onClose={() => {
          setIsEditChildModalOpen(false);
          setEditingChild(null);
        }}
        childId={editingChild?.id || ""}
        currentLabel={editingChild?.label || ""}
        currentUrl={editingChild?.href || ""}
        currentIcon={editingChild?.icon || ""}
      />

      {link.href && !isEditing ? (
        <a
          href={link.href}
          className="relative flex items-center drop-shadow-2xl"
          onContextMenu={(e) => {
            if (!draggable && !isEditing) {
              e.preventDefault();
              setOpenMenu(tileId, "context");
            }
          }}
          onClick={(e) => {
            if (isContextMenuOpen) {
              e.preventDefault();
            } else if (link.id) {
              // Track the visit asynchronously
              fetch("/api/links/visit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ linkId: link.id }),
              }).catch((error) =>
                console.error("Failed to track visit:", error),
              );
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
          className="relative flex cursor-pointer items-center drop-shadow-2xl"
          onContextMenu={(e) => {
            if (!draggable && !isEditing) {
              e.preventDefault();
              setOpenMenu(tileId, "context");
            }
          }}
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
