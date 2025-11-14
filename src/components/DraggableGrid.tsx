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

interface DraggableGridProps {
  links: LinkItem[];
}

export default function DraggableGrid({ links }: DraggableGridProps) {
  const { isEditing, stopEditing } = useMenuStore();
  const router = useRouter();
  const [orderedLinks, setOrderedLinks] = useState<LinkItem[]>(links);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before dragging starts
      },
    }),
  );

  // Update orderedLinks when links prop changes
  useEffect(() => {
    setOrderedLinks(links);
  }, [links]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = orderedLinks.findIndex((link) => link.id === active.id);
      const newIndex = orderedLinks.findIndex((link) => link.id === over.id);

      const newLinks = arrayMove(orderedLinks, oldIndex, newIndex);
      setOrderedLinks(newLinks);

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
            {orderedLinks.map((link) => (
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
