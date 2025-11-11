import { useCallback, useRef, useState } from "react";

import { Position } from "@/hooks/useMeasurePosition";
import { distance } from "@/lib/utils";

export interface Item {
  id: string | number;
  height: number;
  width: number;
}

interface Positions {
  [key: number]: Position;
}

/**
 * Track the visual position of items and calculate when they should swap
 */
export function usePositionReorder<T extends Item>(
  initialState: T[],
): [
  T[],
  (i: number, offset: Position) => void,
  (i: number, deltaX: number, deltaY: number) => void,
] {
  const [order, setOrder] = useState(initialState);

  // Track the visual position of each item
  const positions = useRef<Positions>({});

  const updatePosition = useCallback((i: number, offset: Position) => {
    positions.current[i] = offset;
  }, []);

  const updateOrder = useCallback(
    (i: number, deltaX: number, deltaY: number) => {
      const targetIndex = findIndex(i, deltaX, deltaY, positions.current);
      if (targetIndex !== i) {
        setOrder(move(order, i, targetIndex));
      }
    },
    [order],
  );

  return [order, updatePosition, updateOrder];
}

export const findIndex = (
  i: number,
  deltaX: number,
  deltaY: number,
  positions: Positions,
): number => {
  const targetPos = {
    x: positions[i].x + deltaX,
    y: positions[i].y + deltaY,
  };

  let closestIndex = i;
  let closestDistance = Infinity;

  Object.keys(positions).forEach((key) => {
    const index = parseInt(key);
    if (index === i) return;

    const pos = positions[index];
    const dist = distance(targetPos, pos);

    if (dist < closestDistance) {
      closestDistance = dist;
      closestIndex = index;
    }
  });

  return closestIndex;
};

export const move = <T>(array: T[], from: number, to: number): T[] => {
  const newArray = [...array];
  const [removed] = newArray.splice(from, 1);
  newArray.splice(to, 0, removed);
  return newArray;
};
