"use client";

import { useEffect, useRef, useState } from "react";

type UseActiveTime = {
  activeSeconds: number;
};

export const useActiveTime = (): UseActiveTime => {
  const [activeSeconds, setActiveSeconds] = useState<number>(0);

  const accumulatedMsRef = useRef<number>(0);
  const startMsRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const updateNow = () => {
    const start = startMsRef.current;
    if (start === null) return;
    const now = Date.now();
    const elapsed = accumulatedMsRef.current + (now - start);
    setActiveSeconds(Math.floor(elapsed / 1000));
  };

  const clearTick = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const pause = () => {
    if (startMsRef.current === null) return;
    const now = Date.now();
    accumulatedMsRef.current += now - startMsRef.current;
    startMsRef.current = null;
    clearTick();
    updateNow();
  };

  const resume = () => {
    if (startMsRef.current !== null) return;
    startMsRef.current = Date.now();
    clearTick();
    intervalRef.current = window.setInterval(updateNow, 1000);
  };

  useEffect(() => {
    resume();

    const handleVisibility = () => {
      if (document.hidden) {
        pause();
      } else {
        resume();
      }
    };

    const handleBlur = () => pause();
    const handleFocus = () => resume();

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      pause();
      clearTick();
    };
  }, []);

  return { activeSeconds };
};
