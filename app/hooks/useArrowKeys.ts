"use client";

import { useEffect } from "react";

type UseArrowKeysOptions = {
  onLeft?: () => void;
  onRight?: () => void;
  /**
   * When true, preventDefault will be called on handled arrow presses
   * Default: true
   */
  preventDefault?: boolean;
};

const isEditableTarget = (el: EventTarget | null): boolean => {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea") return true;
  if ((el as HTMLInputElement).isContentEditable) return true;
  return false;
};

export const useArrowKeys = ({ onLeft, onRight, preventDefault = true }: UseArrowKeysOptions) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (isEditableTarget(e.target)) return;

      if (e.key === "ArrowLeft") {
        if (preventDefault) e.preventDefault();
        onLeft?.();
        return;
      }
      if (e.key === "ArrowRight") {
        if (preventDefault) e.preventDefault();
        onRight?.();
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onLeft, onRight, preventDefault]);
};
