"use client";

import { useActiveTimeContext } from "./ActiveTimeContext";
import { formatSecondsToHMS } from "../utils/formatTime";

export const ActiveTimeBar = () => {
  const { activeSeconds } = useActiveTimeContext();

  return (
    <div
      aria-label="Active time counter"
      className="rounded-md bg-gray-100 text-gray-700 px-2 py-1 text-xs"
      tabIndex={0}
      role="status"
    >
      Active: {formatSecondsToHMS(activeSeconds)}
    </div>
  );
};
