import { useState, useRef, useEffect } from "react";
import { Message } from "../types";
import { createWelcomeMessage } from "../constants";

export function useChatMessages() {
  const [messages, setMessages] = useState<Message[]>([createWelcomeMessage()]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (content: string, attachments: string[]) => {
    if (!content.trim() && attachments.length === 0) return;

    const msg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
      attachments,
    };

    setMessages((prev) => [...prev, msg]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Entendido! Estou processando sua solicitação, aguarde um momento...",
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  const startNewConversation = () => {
    setMessages([createWelcomeMessage()]);
  };

  return { messages, messagesEndRef, sendMessage, startNewConversation };
}
