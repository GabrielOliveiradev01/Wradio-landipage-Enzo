"use client";

import { History, PlusCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Conversation } from "../types";
import { useDarkMode } from "@/context/DarkModeContext";

interface HistorySidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewConversation: () => void;
  mobile?: boolean;
}

export default function HistorySidebar({
  conversations,
  activeId,
  onSelect,
  onNewConversation,
  mobile = false,
}: HistorySidebarProps) {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={cn(
        "flex flex-col border-r transition-colors duration-300",
        mobile ? "h-full w-full" : "h-full",
        darkMode
          ? "bg-[#1c1c1e] border-white/10"
          : "bg-gray-50 border-gray-200",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 border-b",
          darkMode ? "border-white/10" : "border-gray-200",
        )}
      >
        <span
          className={cn(
            "font-semibold text-sm flex items-center gap-1.5",
            darkMode ? "text-zinc-300" : "text-gray-700",
          )}
        >
          <History
            className={cn(
              "w-4 h-4",
              darkMode ? "text-zinc-500" : "text-gray-400",
            )}
          />
          Histórico
        </span>
        <button
          onClick={onNewConversation}
          className="flex items-center gap-1 text-orange-500 hover:text-orange-600 text-xs font-medium transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Nova
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={cn(
              "w-full text-left px-4 py-3 transition-colors border-r-2",
              activeId === conv.id
                ? darkMode
                  ? "bg-zinc-800 border-orange-500"
                  : "bg-white border-orange-500"
                : cn(
                    "border-transparent",
                    darkMode ? "hover:bg-zinc-800" : "hover:bg-white",
                  ),
            )}
          >
            <p
              className={cn(
                "text-sm font-medium truncate",
                activeId === conv.id
                  ? "text-orange-500"
                  : darkMode
                    ? "text-zinc-300"
                    : "text-gray-800",
              )}
            >
              {conv.title}
            </p>
            <p
              className={cn(
                "text-xs truncate mt-0.5 leading-relaxed",
                darkMode ? "text-zinc-500" : "text-gray-400",
              )}
            >
              {conv.lastMessage}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Clock
                className={cn(
                  "w-3 h-3",
                  darkMode ? "text-zinc-600" : "text-gray-300",
                )}
              />
              <span
                className={cn(
                  "text-[10px]",
                  darkMode ? "text-zinc-500" : "text-gray-400",
                )}
              >
                {conv.timestamp}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
