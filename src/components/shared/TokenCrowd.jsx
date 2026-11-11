// src/components/shared/TokenCrowd.jsx
// Animated crowd of tester tokens inside VennCanvas with drag and tap-to-select support

import React from 'react';
import { motion } from 'framer-motion';

export default function TokenCrowd({
  tokens = [], // array of { id, name, avatar, mask, x, y }
  selectedTokenId = null,
  onTokenTap,
  highlightedTokenIds = [],
  outlinedTokenIds = [],
}) {
  return (
    <g className="venn-tokens-layer">
      {tokens.map((token) => {
        const isSelected = token.id === selectedTokenId;
        const isLit = highlightedTokenIds.includes(token.id);
        const isOutlined = outlinedTokenIds.includes(token.id);

        return (
          <motion.g
            key={token.id}
            initial={false}
            animate={{ x: token.x, y: token.y }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className={`venn-token-node ${isSelected ? 'is-selected' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onTokenTap && onTokenTap(token);
            }}
            style={{ cursor: 'pointer' }}
          >
            {/* Outline if target set */}
            {isOutlined && (
              <circle
                r="18"
                fill="none"
                stroke="#f2c94c"
                strokeWidth="2.5"
                strokeDasharray="3 3"
                className="token-target-outline"
              />
            )}

            {/* Lit Halo if student shaded */}
            {isLit && (
              <circle
                r="16"
                fill="rgba(45, 156, 219, 0.45)"
                className="token-lit-halo"
              />
            )}

            {/* Token disc */}
            <circle
              r="13"
              fill={isSelected ? '#f2c94c' : 'rgba(22, 27, 34, 0.95)'}
              stroke={isSelected ? '#fff' : isLit ? '#2d9cdb' : 'rgba(255, 255, 255, 0.4)'}
              strokeWidth={isSelected ? '2.5' : '1.5'}
              className="token-disc"
            />

            {/* Avatar emoji */}
            <text
              textAnchor="middle"
              y="5"
              fontSize="12"
              className="token-avatar-emoji"
              pointerEvents="none"
            >
              {token.avatar || '🧑🏻'}
            </text>
          </motion.g>
        );
      })}
    </g>
  );
}

