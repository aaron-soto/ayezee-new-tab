"use client";

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import LinkTile, { LinkItem } from "@/components/tiles/LinkTile";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useCallback, useEffect, useRef, useState } from "react";

import { useMenuStore } from "@/lib/stores/menuStore";
import { useRouter } from "next/navigation";
import useSearchStore from "@/lib/stores/searchStore";
import { useSortStore } from "@/lib/stores/sortStore";

interface DraggableGridProps {
  links: LinkItem[];
}

interface PendingSave {
  type: string;
  data: { id: string; position: number }[];
}

export default function DraggableGrid({ links }: DraggableGridProps) {
  const { isEditing, stopEditing } = useMenuStore();
  const { sortMode, setSortMode } = useSortStore();
  const { query } = useSearchStore();
  const router = useRouter();
  const [orderedLinks, setOrderedLinks] = useState<LinkItem[]>(links);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeId, setActiveId] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingSaveRef = useRef<PendingSave | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before dragging starts
      },
    }),
  );

  // Debounced save function - saves changes 1.5 seconds after last drag
  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      if (!pendingSaveRef.current) return;

      const { data } = pendingSaveRef.current;
      pendingSaveRef.current = null;

      try {
        await fetch("/api/links/reorder", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ links: data }),
        });
        // Only refresh after successful save
        router.refresh();
      } catch (error) {
        console.error("Failed to save changes:", error);
      }
    }, 1500);
  }, []); // Empty deps - router.refresh() doesn't need to be in deps

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Update orderedLinks when links prop changes or sort mode changes
  useEffect(() => {
    if (sortMode === "most-visited") {
      // Sort by visit count (descending)
      const sorted = [...links].sort(
        (a, b) => (b.visitCount || 0) - (a.visitCount || 0),
      );
      setOrderedLinks(sorted);
    } else {
      // Use custom order (by position)
      setOrderedLinks(links);
    }
  }, [links, sortMode]);

  // Filter links based on search query
  const filteredLinks = orderedLinks.filter((link) => {
    if (!query) return true;
    const searchTerm = query.toLowerCase();
    return (
      link.label.toLowerCase().includes(searchTerm) ||
      link.href?.toLowerCase().includes(searchTerm)
    );
  });

  const handleDragStart = (event: DragStartEvent) => {
    console.log("🚀 Drag started:", event.active.id, "sortMode:", sortMode);
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log("🎯 Drag ended:", event.active.id, "sortMode:", sortMode);
    setActiveId(null);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Reorder by swapping positions
      const oldIndex = orderedLinks.findIndex((link) => link.id === active.id);
      const newIndex = orderedLinks.findIndex((link) => link.id === over.id);

      const newLinks = arrayMove(orderedLinks, oldIndex, newIndex);

      // Optimistically update local state immediately
      setOrderedLinks(newLinks);

      // When user manually reorders, switch to custom order mode
      if (sortMode === "most-visited") {
        setSortMode("custom");
      }

      // Queue the save with debouncing
      const updates = newLinks
        .filter((link) => link.id)
        .map((link, index) => ({
          id: link.id!,
          position: index,
        }));
      pendingSaveRef.current = {
        type: "reorder",
        data: updates,
      };
      debouncedSave();
    }
  };

  return (
    <>
      {/* Overlay to capture clicks outside tiles when in edit mode */}
      {isEditing && (
        <div
          className="fixed inset-0 z-10"
          onClick={stopEditing}
          style={{ cursor: "default" }}
        />
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredLinks.map((link) => link.id || link.label)}
          strategy={rectSortingStrategy}
        >
          <div
            data-grid-container="true"
            className="relative z-20 flex w-full flex-wrap items-center justify-start gap-x-6 gap-y-6"
          >
            {filteredLinks.map((link) => (
              <LinkTile
                key={link.id || link.label}
                link={link}
                draggable={isEditing}
                linkId={link.id || link.label}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
}
