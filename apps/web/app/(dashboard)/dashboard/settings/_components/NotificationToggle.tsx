"use client";

import { useState } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDarkMode } from "@/context/DarkModeContext";

interface NotificationToggleProps {
  label: string;
  defaultOn: boolean;
}

export default function NotificationToggle({
  label,
  defaultOn,
}: NotificationToggleProps) {
  const [on, setOn] = useState(defaultOn);
  const { darkMode } = useDarkMode();

  return (
    <div className="flex items-center justify-between">
      <span
        className={cn(
          "text-sm",
          darkMode ? "text-zinc-300" : "text-gray-700",
        )}
      >
        {label}
      </span>
      <button onClick={() => setOn((v) => !v)} className="transition-colors">
        {on ? (
          <ToggleRight className="w-6 h-6 text-orange-500" />
        ) : (
          <ToggleLeft
            className={cn(
              "w-6 h-6",
              darkMode ? "text-zinc-600" : "text-gray-300",
            )}
          />
        )}
      </button>
    </div>
  );
}
