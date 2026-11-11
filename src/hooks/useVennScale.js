// src/hooks/useVennScale.js
// Enforces minimum rendered font size (12px) on SVG text elements across viewport sizes

import { useState, useEffect, useRef } from 'react';

export function useVennScale(viewBoxWidth = 640) {
  const containerRef = useRef(null);
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const renderedWidth = entry.contentRect.width || 640;
        const scale = renderedWidth / viewBoxWidth;
        // If scale < 1, text needs to increase in viewBox units to maintain rendered px size
        setScaleFactor(scale > 0 ? scale : 1);
      }
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [viewBoxWidth]);

  // viewBox font-size calculator: returns size in viewBox units that yields at least minPx on screen
  const getScaledFontSize = (baseViewBoxPx, minRenderedPx = 12) => {
    const desiredViewBoxPx = minRenderedPx / scaleFactor;
    return Math.max(baseViewBoxPx, Math.round(desiredViewBoxPx));
  };

  return { containerRef, scaleFactor, getScaledFontSize };
}

