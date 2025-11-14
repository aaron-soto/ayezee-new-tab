"use client";

import {
  DndContext,
  DragEndEvent,
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
import { useEffect, useState } from "react";

import { useMenuStore } from "@/lib/stores/menuStore";
import { useRouter } from "next/navigation";
import useSearchStore from "@/lib/stores/searchStore";
import { useSortStore } from "@/lib/stores/sortStore";

interface DraggableGridProps {
  links: LinkItem[];
}

export default function DraggableGrid({ links }: DraggableGridProps) {
  const { isEditing, stopEditing } = useMenuStore();
  const { sortMode, setSortMode } = useSortStore();
  const { query } = useSearchStore();
  const router = useRouter();
  const [orderedLinks, setOrderedLinks] = useState<LinkItem[]>(links);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before dragging starts
      },
    }),
  );

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = orderedLinks.findIndex((link) => link.id === active.id);
      const newIndex = orderedLinks.findIndex((link) => link.id === over.id);

      const newLinks = arrayMove(orderedLinks, oldIndex, newIndex);
      setOrderedLinks(newLinks);

      // When user manually reorders, switch to custom order mode
      if (sortMode === "most-visited") {
        setSortMode("custom");
      }

      // Update positions in the database
      await updateLinkPositions(newLinks);
      router.refresh();
    }
  };

  const updateLinkPositions = async (links: LinkItem[]) => {
    try {
      const updates = links.map((link, index) => ({
        id: link.id,
        position: index,
      }));

      await fetch("/api/links/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ links: updates }),
      });
    } catch (error) {
      console.error("Failed to update link positions:", error);
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
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedLinks.map((link) => link.id || link.label)}
          strategy={rectSortingStrategy}
        >
          <div className="relative z-20 flex w-full flex-wrap items-center justify-start gap-x-6 gap-y-6">
            {filteredLinks.map((link) => (
              <LinkTile
                key={link.id || link.label}
                link={link}
                draggable={isEditing}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
}
