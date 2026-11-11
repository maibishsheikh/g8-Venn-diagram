// src/components/shared/VennCanvas.jsx
// Live SVG Venn Diagram rendering for 2-set and 3-set diagrams with patterns, counts, and hit-zones

import React from 'react';
import './VennCanvas.css';
import { getGeometry2, getGeometry3, regionAnchor, VIEWBOX_2, VIEWBOX_3 } from '../../utils/vennGeometry.js';
import { useVennScale } from '../../hooks/useVennScale.js';

export default function VennCanvas({
  descriptor,
  mode = 'display', // 'display' | 'tap-region' | 'paint' | 'edit-counts' | 'free'
  onRegionTap,
  highlightMasks = [],
  shadeMasks = [],
  customGeometry = null,
  compact = false,
  children,
}) {
  const isThree = descriptor?.sets === 3;
  const viewBox = isThree ? VIEWBOX_3 : VIEWBOX_2;
  const { containerRef, getScaledFontSize } = useVennScale(viewBox.width);

  const geom = customGeometry || (isThree ? getGeometry3() : getGeometry2(descriptor?.shape || 'overlap'));

  const regions = descriptor?.regions || [];
  const setNames = descriptor?.names || (isThree ? ['A', 'B', 'C'] : ['A', 'B']);

  const fontSizeTitle = getScaledFontSize(15, 12);
  const fontSizeCount = getScaledFontSize(compact ? 16 : 22, 14);
  const fontSizeLabel = getScaledFontSize(12, 11);

  return (
    <div
      ref={containerRef}
      className={`venn-canvas-wrap ${compact ? 'venn-canvas--compact' : ''} mode-${mode}`}
    >
      <svg
        viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
        className="venn-svg"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Venn Diagram"
      >
        <defs>
          {/* Diagonal Hatch for Set A */}
          <pattern id="hatch-a" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="10" stroke="#2d9cdb" strokeWidth="2.5" opacity="0.45" />
          </pattern>

          {/* Dots for Set B */}
          <pattern id="dots-b" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="6" cy="6" r="2.2" fill="#f2994a" opacity="0.65" />
          </pattern>

          {/* Crosshatch for Set C */}
          <pattern id="crosshatch-c" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M 0 0 L 12 12 M 12 0 L 0 12" stroke="#27ae8f" strokeWidth="2" opacity="0.5" />
          </pattern>

          {/* Active Highlight Pattern */}
          <pattern id="pattern-active" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#f2c94c" strokeWidth="3" opacity="0.8" />
          </pattern>
        </defs>

        {/* Universal Set Rectangle (ξ) */}
        <rect
          x={geom.rect.x}
          y={geom.rect.y}
          width={geom.rect.width}
          height={geom.rect.height}
          rx="18"
          className={`venn-universe-rect ${shadeMasks.includes(0) ? 'is-shaded' : ''} ${highlightMasks.includes(0) ? 'is-highlighted' : ''}`}
          onClick={() => (mode === 'tap-region' || mode === 'paint') && onRegionTap && onRegionTap(0)}
        />

        {/* Universal Set Label ξ */}
        <text
          x={geom.rect.x + 18}
          y={geom.rect.y + 26}
          className="venn-universal-label"
          style={{ fontSize: `${fontSizeTitle}px` }}
        >
          ξ (Universal Set{descriptor?.universalTotal ? ` = ${descriptor.universalTotal}` : ''})
        </text>

        {/* Circles & Fills */}
        {geom.circles.map((c, idx) => {
          const letter = c.letter;
          const name = setNames[idx] || letter;
          const patternId = c.pattern === 'dots' ? 'dots-b' : c.pattern === 'crosshatch' ? 'crosshatch-c' : 'hatch-a';

          return (
            <g key={letter} className={`venn-circle-group circle-${letter.toLowerCase()}`}>
              {/* Background circle base */}
              <circle
                cx={c.cx}
                cy={c.cy}
                r={c.r}
                className="venn-circle-base"
                style={{ fill: c.color }}
              />

              {/* Accessible Pattern Overlay */}
              <circle
                cx={c.cx}
                cy={c.cy}
                r={c.r}
                fill={`url(#${patternId})`}
                className="venn-circle-pattern"
              />

              {/* Perimeter Outline */}
              <circle
                cx={c.cx}
                cy={c.cy}
                r={c.r}
                className="venn-circle-stroke"
                style={{ stroke: c.color }}
              />

              {/* Circle Label Title */}
              <text
                x={c.cx}
                y={c.cy - c.r + 26}
                textAnchor="middle"
                className="venn-set-title"
                style={{ fontSize: `${fontSizeTitle}px` }}
              >
                {letter}: {name}
              </text>
            </g>
          );
        })}

        {/* Region Shading & Interactive Overlays */}
        {regions.map((reg) => {
          const isShaded = shadeMasks.includes(reg.mask);
          const isHighlighted = highlightMasks.includes(reg.mask);
          const anchor = regionAnchor(reg.mask, geom);

          return (
            <g
              key={reg.mask}
              className={`venn-region-node ${isShaded ? 'is-shaded' : ''} ${isHighlighted ? 'is-highlighted' : ''}`}
              onClick={() => (mode === 'tap-region' || mode === 'paint') && onRegionTap && onRegionTap(reg.mask)}
            >
              {/* Hit target circle for easy tapping on mobile/touch */}
              {(mode === 'tap-region' || mode === 'paint') && (
                <circle
                  cx={anchor.x}
                  cy={anchor.y}
                  r="34"
                  className="venn-tap-target"
                />
              )}

              {/* Shaded Indicator circle if selected */}
              {isShaded && (
                <circle
                  cx={anchor.x}
                  cy={anchor.y}
                  r="36"
                  className="venn-shaded-halo"
                />
              )}

              {/* Region Count Badge */}
              <g transform={`translate(${anchor.x}, ${anchor.y})`}>
                <rect
                  x="-26"
                  y="-18"
                  width="52"
                  height="36"
                  rx="10"
                  className={`venn-count-badge ${isShaded ? 'badge-shaded' : ''} ${isHighlighted ? 'badge-highlighted' : ''}`}
                />
                <text
                  x="0"
                  y="7"
                  textAnchor="middle"
                  className="venn-count-text"
                  style={{ fontSize: `${fontSizeCount}px` }}
                >
                  {reg.text !== undefined ? reg.text : reg.count}
                </text>
              </g>

              {/* Small descriptive caption under count badge if not compact */}
              {!compact && reg.label && reg.mask !== 0 && (
                <text
                  x={anchor.x}
                  y={anchor.y + 28}
                  textAnchor="middle"
                  className="venn-region-sublabel"
                  style={{ fontSize: `${fontSizeLabel}px` }}
                >
                  {reg.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Optional token crowd and dynamic children layer */}
        {children}
      </svg>
    </div>
  );
}

