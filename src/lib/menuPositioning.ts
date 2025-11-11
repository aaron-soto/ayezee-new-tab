export interface MenuPosition {
  top: number;
  left: number;
  transform: string;
}

/**
 * Calculate menu position ensuring it stays within viewport bounds with 8px margin
 * @param triggerRect - The bounding rect of the element that triggered the menu
 * @param menuWidth - The width of the menu to be positioned
 * @param menuHeight - The height of the menu to be positioned
 * @param offsetY - Vertical offset from the trigger element (default: 16px)
 * @returns Position object with top, left, and transform values
 */
export function calculateMenuPosition(
  triggerRect: DOMRect,
  menuWidth: number,
  menuHeight: number,
  offsetY: number = 16,
): MenuPosition {
  const margin = 8;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Start with left-aligned position
  let left = triggerRect.left;
  let top = triggerRect.bottom + offsetY;

  // Check right overflow
  const rightEdge = left + menuWidth;
  if (rightEdge > viewportWidth - margin) {
    left = viewportWidth - menuWidth - margin;
  }

  // Check left overflow
  if (left < margin) {
    left = margin;
  }

  // Check bottom overflow
  const bottomEdge = top + menuHeight;
  if (bottomEdge > viewportHeight - margin) {
    // Position above the trigger if there's not enough space below
    const topPosition = triggerRect.top - menuHeight - margin;
    if (topPosition > margin) {
      top = topPosition;
    } else {
      // If it doesn't fit above either, just position at bottom with margin
      top = viewportHeight - menuHeight - margin;
    }
  }

  // Check top overflow
  if (top < margin) {
    top = margin;
  }

  return {
    top,
    left,
    transform: "none",
  };
}
