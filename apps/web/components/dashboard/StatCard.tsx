"use client";

import { cn } from "@/lib/utils";
import { useDarkMode } from "@/context/DarkModeContext";

interface StatCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function StatCard({ label, value, icon, className }: StatCardProps) {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={cn(
        "rounded-2xl p-6 flex items-center justify-between border transition-colors duration-300",
        darkMode
          ? "border-white/10 text-white"
          : "bg-gray-50 border-gray-100",
        className,
      )}
      style={darkMode ? { backgroundColor: "#09090b" } : undefined}
    >
      <div>
        <p
          className={cn(
            "text-xs font-semibold tracking-widest uppercase mb-2",
            darkMode ? "text-orange-400" : "text-gray-400",
          )}
        >
          {label}
        </p>
        <p
          className={cn(
            "text-2xl font-bold",
            darkMode ? "text-white" : "text-gray-900",
          )}
        >
          {value}
        </p>
      </div>
      {icon && (
        <div
          className={cn(
            "flex-shrink-0 ml-4 w-12 h-12 rounded-xl flex items-center justify-center",
            darkMode ? "bg-white/10" : "bg-white border border-gray-100",
          )}
        >
          {icon}
        </div>
      )}
    </div>
  );
}
