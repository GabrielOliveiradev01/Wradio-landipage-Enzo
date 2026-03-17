"use client";

import { Bot, ChevronLeft, ChevronRight, History, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDarkMode } from "@/context/DarkModeContext";

interface ChatHeaderProps {
  historyOpen: boolean;
  onToggleHistory: () => void;
  onOpenMobileHistory: () => void;
  onNewConversation: () => void;
}

export default function ChatHeader({
  historyOpen,
  onToggleHistory,
  onOpenMobileHistory,
  onNewConversation,
}: ChatHeaderProps) {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 border-b flex-shrink-0 transition-colors duration-300",
        darkMode
          ? "border-white/10 bg-[#1c1c1e]"
          : "border-gray-200 bg-white",
      )}
    >
      <button
        onClick={onOpenMobileHistory}
        className={cn(
          "p-1.5 rounded-lg transition-colors md:hidden",
          darkMode
            ? "text-zinc-400 hover:text-white hover:bg-white/10"
            : "text-gray-500 hover:bg-gray-100",
        )}
        title="Ver histórico"
      >
        <History className="w-4 h-4" />
      </button>

      <button
        onClick={onToggleHistory}
        className={cn(
          "p-1.5 rounded-lg transition-colors hidden md:flex items-center",
          darkMode
            ? "text-zinc-400 hover:text-white hover:bg-white/10"
            : "text-gray-500 hover:bg-gray-100",
        )}
        title={historyOpen ? "Fechar histórico" : "Abrir histórico"}
      >
        {historyOpen ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
        <Bot className="w-[18px] h-[18px] text-white" />
      </div>

      <div className="min-w-0">
        <p
          className={cn(
            "text-sm font-semibold leading-tight",
            darkMode ? "text-white" : "text-gray-900",
          )}
        >
          Assistente IA
        </p>
        <p className="text-xs text-green-500 leading-tight">Online</p>
      </div>

      <div className="ml-auto">
        <button
          onClick={onNewConversation}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors border border-orange-200"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Nova conversa
        </button>
      </div>
    </div>
  );
}
