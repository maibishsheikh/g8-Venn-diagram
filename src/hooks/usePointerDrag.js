// src/hooks/usePointerDrag.js
// Native Pointer Events drag-and-drop hook with pointer capture & tap vs drag detection

import { useRef, useCallback } from 'react';

export function usePointerDrag({ onDragStart, onDragMove, onDragEnd, onSelectTap }) {
  const dragStateRef = useRef(null);

  const handlePointerDown = useCallback((e, item) => {
    // Only primary button
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);

    dragStateRef.current = {
      pointerId: e.pointerId,
      target,
      item,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      isDragging: false,
    };
  }, []);

  const handlePointerMove = useCallback((e) => {
    const state = dragStateRef.current;
    if (!state || state.pointerId !== e.pointerId) return;

    state.currentX = e.clientX;
    state.currentY = e.clientY;

    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;

    if (!state.isDragging) {
      // 6px movement threshold to distinguish tap from drag
      if (Math.hypot(dx, dy) >= 6) {
        state.isDragging = true;
        if (onDragStart) onDragStart(state.item, { x: e.clientX, y: e.clientY });
      }
    } else {
      if (onDragMove) onDragMove(state.item, { x: e.clientX, y: e.clientY, dx, dy });
    }
  }, [onDragStart, onDragMove]);

  const handlePointerUp = useCallback((e) => {
    const state = dragStateRef.current;
    if (!state || state.pointerId !== e.pointerId) return;

    try {
      state.target.releasePointerCapture(e.pointerId);
    } catch {
      // pointer capture might already be released
    }

    if (state.isDragging) {
      if (onDragEnd) {
        onDragEnd(state.item, { x: e.clientX, y: e.clientY });
      }
    } else {
      // It was a tap!
      if (onSelectTap) {
        onSelectTap(state.item);
      }
    }

    dragStateRef.current = null;
  }, [onDragEnd, onSelectTap]);

  const handlePointerCancel = useCallback((e) => {
    const state = dragStateRef.current;
    if (state && state.pointerId === e.pointerId) {
      try {
        state.target.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      dragStateRef.current = null;
    }
  }, []);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  };
}

