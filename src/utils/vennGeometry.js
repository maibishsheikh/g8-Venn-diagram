// src/utils/vennGeometry.js
// Single source of truth for Venn geometric layout, hit-testing, and centroids

export const VIEWBOX_2 = { width: 640, height: 400 };
export const VIEWBOX_3 = { width: 640, height: 480 };

export function getGeometry2(overlapState = 'overlap', customDistance = null) {
  const rect = { x: 20, y: 20, width: 600, height: 360 };
  const r = 135;
  const cy = 200;

  let cxA = 245;
  let cxB = 395;

  if (overlapState === 'disjoint') {
    cxA = 180;
    cxB = 460;
  } else if (overlapState === 'subset') {
    cxA = 320;
    cxB = 320; // Circle A inside Circle B with smaller radius
    return {
      sets: 2,
      rect,
      circles: [
        { letter: 'A', cx: 320, cy: 200, r: 85, color: 'var(--set-a)', pattern: 'hatch' },
        { letter: 'B', cx: 320, cy: 200, r: 145, color: 'var(--set-b)', pattern: 'dots' },
      ],
      shape: 'subset',
    };
  } else if (typeof customDistance === 'number') {
    const mid = 320;
    cxA = mid - customDistance / 2;
    cxB = mid + customDistance / 2;
  }

  return {
    sets: 2,
    rect,
    circles: [
      { letter: 'A', cx: cxA, cy, r, color: 'var(--set-a)', pattern: 'hatch' },
      { letter: 'B', cx: cxB, cy, r, color: 'var(--set-b)', pattern: 'dots' },
    ],
    shape: overlapState,
  };
}

export function getGeometry3() {
  const rect = { x: 20, y: 20, width: 600, height: 440 };
  const r = 125;
  return {
    sets: 3,
    rect,
    circles: [
      { letter: 'A', cx: 320, cy: 180, r, color: 'var(--set-a)', pattern: 'hatch' },
      { letter: 'B', cx: 245, cy: 295, r, color: 'var(--set-b)', pattern: 'dots' },
      { letter: 'C', cx: 395, cy: 295, r, color: 'var(--set-c)', pattern: 'crosshatch' },
    ],
    shape: 'overlap',
  };
}

export function isPointInCircle(x, y, circle) {
  const dx = x - circle.cx;
  const dy = y - circle.cy;
  return dx * dx + dy * dy <= circle.r * circle.r;
}

export function isPointInRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
}

/**
 * Returns bitmask for point (x, y).
 * Bit 0 = in A, Bit 1 = in B, Bit 2 = in C.
 * If outside the bounding universal rect, returns -1.
 */
export function maskAt(x, y, geometry) {
  if (!isPointInRect(x, y, geometry.rect)) {
    return -1;
  }

  let mask = 0;
  for (let i = 0; i < geometry.circles.length; i++) {
    const c = geometry.circles[i];
    if (isPointInCircle(x, y, c)) {
      mask |= (1 << i);
    }
  }
  return mask;
}

/**
 * Representative coordinate anchor for labels & token clusters in region `mask`.
 */
export function regionAnchor(mask, geometry) {
  if (geometry.sets === 3) {
    switch (mask) {
      case 0: return { x: 65,  y: 65 };   // outside
      case 1: return { x: 320, y: 120 };  // only A
      case 2: return { x: 190, y: 325 };  // only B
      case 4: return { x: 450, y: 325 };  // only C
      case 3: return { x: 265, y: 225 };  // AB only
      case 5: return { x: 375, y: 225 };  // AC only
      case 6: return { x: 320, y: 345 };  // BC only
      case 7: return { x: 320, y: 260 };  // all three
      default: return { x: 320, y: 240 };
    }
  }

  // 2 sets
  if (geometry.shape === 'subset') {
    switch (mask) {
      case 0: return { x: 70,  y: 70 };   // outside
      case 1: return { x: 320, y: 200 };  // A (inside)
      case 2: return { x: 320, y: 100 };  // only B (outer ring)
      case 3: return { x: 320, y: 200 };  // both = A
      default: return { x: 320, y: 200 };
    }
  }

  if (geometry.shape === 'disjoint') {
    switch (mask) {
      case 0: return { x: 320, y: 200 };  // middle outside
      case 1: return { x: 180, y: 200 };  // only A
      case 2: return { x: 460, y: 200 };  // only B
      case 3: return { x: 320, y: 200 };
      default: return { x: 320, y: 200 };
    }
  }

  // Standard 2-set overlap
  const cA = geometry.circles[0];
  const cB = geometry.circles[1];
  const midX = (cA.cx + cB.cx) / 2;

  switch (mask) {
    case 0: return { x: 70, y: 65 };                       // Outside (ξ)
    case 1: return { x: cA.cx - (cA.cx - geometry.rect.x) * 0.35, y: cA.cy }; // Only A
    case 2: return { x: cB.cx + (geometry.rect.x + geometry.rect.width - cB.cx) * 0.35, y: cB.cy }; // Only B
    case 3: return { x: midX, y: cA.cy };                 // Overlap (both)
    default: return { x: midX, y: cA.cy };
  }
}

/**
 * Hit test for tapping or dropping on a region.
 */
export function hitTest(x, y, geometry) {
  const m = maskAt(x, y, geometry);
  return m >= 0 ? m : 0;
}

