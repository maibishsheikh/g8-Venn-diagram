// src/utils/tokenLayout.js
// Deterministic token slot generator for Venn diagram regions

import { regionAnchor, maskAt } from './vennGeometry.js';

/**
 * Returns an array of { id, x, y, mask } coordinates for tokens within their target region
 */
export function generateTokenSlots(tokens, geometry, tokenDiameter = 28) {
  // Group tokens by mask
  const byMask = {};
  for (const t of tokens) {
    if (!byMask[t.mask]) byMask[t.mask] = [];
    byMask[t.mask].push(t);
  }

  const result = [];

  for (const maskStr of Object.keys(byMask)) {
    const mask = Number(maskStr);
    const group = byMask[mask];
    const anchor = regionAnchor(mask, geometry);
    const n = group.length;

    // Spiral/hex-ring distribution around anchor point
    const spacing = tokenDiameter + 4;

    for (let i = 0; i < n; i++) {
      let x, y;

      if (i === 0) {
        x = anchor.x;
        y = anchor.y;
      } else {
        // Concentric rings
        const ring = Math.floor((Math.sqrt(i) + 1) / 1.6);
        const ringTotal = ring * 6;
        const angle = (i / ringTotal) * 2 * Math.PI;
        const dist = ring * spacing;

        const candidateX = anchor.x + Math.cos(angle) * dist;
        const candidateY = anchor.y + Math.sin(angle) * dist;

        // Verify the candidate is still inside the mask region
        const testedMask = maskAt(candidateX, candidateY, geometry);
        if (testedMask === mask) {
          x = candidateX;
          y = candidateY;
        } else {
          // Fallback clamp closer to anchor
          x = anchor.x + Math.cos(angle) * (dist * 0.45);
          y = anchor.y + Math.sin(angle) * (dist * 0.45);
        }
      }

      result.push({
        ...group[i],
        x: Math.round(x),
        y: Math.round(y),
      });
    }
  }

  return result;
}

