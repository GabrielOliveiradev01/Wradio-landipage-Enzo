"use client";

import { RefObject } from "react";
import { Message } from "../types";
import MessageBubble from "./MessageBubble";
import { cn } from "@/lib/utils";
import { useDarkMode } from "@/context/DarkModeContext";

interface MessageListProps {
  messages: Message[];
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export default function MessageList({ messages, messagesEndRef }: MessageListProps) {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto px-4 py-4 space-y-4 transition-colors duration-300",
        darkMode ? "bg-[#111113]" : "",
      )}
    >
      {messages.map((msg) => (
        <MessageBubble key={msg.id} msg={msg} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
