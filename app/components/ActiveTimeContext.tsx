/* eslint-disable react-refresh/only-export-components */
"use client";

import { createContext, useContext, type ReactNode, useMemo } from "react";
import { useActiveTime } from "../hooks/useActiveTime";

type ActiveTimeContextValue = {
  activeSeconds: number;
};

const ActiveTimeContext = createContext<ActiveTimeContextValue | undefined>(undefined);

type ActiveTimeProviderProps = {
  children: ReactNode;
};

export const ActiveTimeProvider = ({ children }: ActiveTimeProviderProps) => {
  const { activeSeconds } = useActiveTime();
  const value = useMemo(() => ({ activeSeconds }), [activeSeconds]);

  return <ActiveTimeContext.Provider value={value}>{children}</ActiveTimeContext.Provider>;
};

export const useActiveTimeContext = (): ActiveTimeContextValue => {
  const ctx = useContext(ActiveTimeContext);
  if (!ctx) {
    throw new Error("useActiveTimeContext must be used within ActiveTimeProvider");
    }
  return ctx;
};
