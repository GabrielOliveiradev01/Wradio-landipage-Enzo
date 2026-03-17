"use client";

import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "../types";
import { useDarkMode } from "@/context/DarkModeContext";

export default function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  const { darkMode } = useDarkMode();

  return (
    <div className={cn("flex gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
          isUser ? "bg-gray-700" : "bg-orange-500",
        )}
      >
        {isUser ? (
          <User className="w-[14px] h-[14px] text-white" />
        ) : (
          <Bot className="w-[14px] h-[14px] text-white" />
        )}
      </div>

      <div
        className={cn(
          "max-w-[72%] md:max-w-[60%] rounded-2xl px-4 py-2.5 text-sm",
          isUser
            ? "bg-orange-500 text-white rounded-tr-sm"
            : cn(
                "rounded-tl-sm",
                darkMode
                  ? "bg-zinc-800 text-zinc-100"
                  : "bg-gray-100 text-gray-800",
              ),
        )}
      >
        {msg.content && (
          <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
        )}

        {msg.attachments && msg.attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {msg.attachments.map((name, i) => (
              <span
                key={i}
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  isUser
                    ? "bg-orange-400/40 text-orange-100"
                    : darkMode
                      ? "bg-zinc-700 text-zinc-300 border border-zinc-600"
                      : "bg-white text-gray-600 border border-gray-200",
                )}
              >
                📎 {name}
              </span>
            ))}
          </div>
        )}

        <p
          className={cn(
            "text-[10px] mt-1.5",
            isUser
              ? "text-orange-200 text-right"
              : darkMode
                ? "text-zinc-500"
                : "text-gray-400",
          )}
        >
          {msg.timestamp.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
