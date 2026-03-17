"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MOCK_CONVERSATIONS } from "./constants";
import { useChatMessages } from "./hooks/useChatMessages";
import { useInputBar } from "./hooks/useInputBar";
import { useAudioRecorder } from "./hooks/useAudioRecorder";
import ChatHeader from "./components/ChatHeader";
import HistorySidebar from "./components/HistorySidebar";
import MobileHistoryOverlay from "./components/MobileHistoryOverlay";
import MessageList from "./components/MessageList";
import InputBar from "./components/InputBar";
import { useDarkMode } from "@/context/DarkModeContext";

interface ChatInterfaceProps {
  initialPrompt?: string;
}

export default function ChatInterface({ initialPrompt }: ChatInterfaceProps) {
  const [historyOpen, setHistoryOpen] = useState(true);
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { darkMode } = useDarkMode();

  const { messages, messagesEndRef, sendMessage, startNewConversation } =
    useChatMessages();

  const {
    input,
    setInput,
    attachments,
    textareaRef,
    fileInputRef,
    imageInputRef,
    handleFiles,
    removeAttachment,
    reset: resetInputBar,
  } = useInputBar();

  const {
    isRecording,
    recordingTime,
    start: startRecording,
    stop: stopRecording,
  } = useAudioRecorder((_blob, durationText) => {
    setInput((prev) => (prev ? `${prev} ${durationText}` : durationText));
  });

  useEffect(() => {
    if (initialPrompt) {
      sendMessage(initialPrompt, []);
    }
  }, []);

  const handleSend = () => {
    if (!input.trim() && attachments.length === 0) return;
    sendMessage(
      input,
      attachments.map((f) => f.name),
    );
    resetInputBar();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewConversation = () => {
    startNewConversation();
    resetInputBar();
    setActiveId(null);
    setMobileHistoryOpen(false);
  };

  return (
    <div
      className={cn(
        "flex h-full rounded-xl overflow-hidden border transition-colors duration-300",
        darkMode
          ? "border-white/10 bg-[#1c1c1e]"
          : "border-gray-200 bg-white",
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 transition-all duration-300 overflow-hidden hidden md:block",
          historyOpen ? "w-[260px]" : "w-0",
        )}
      >
        <HistorySidebar
          conversations={MOCK_CONVERSATIONS}
          activeId={activeId}
          onSelect={setActiveId}
          onNewConversation={handleNewConversation}
        />
      </div>

      <MobileHistoryOverlay
        open={mobileHistoryOpen}
        onClose={() => setMobileHistoryOpen(false)}
        conversations={MOCK_CONVERSATIONS}
        activeId={activeId}
        onSelect={setActiveId}
        onNewConversation={handleNewConversation}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader
          historyOpen={historyOpen}
          onToggleHistory={() => setHistoryOpen((prev) => !prev)}
          onOpenMobileHistory={() => setMobileHistoryOpen(true)}
          onNewConversation={handleNewConversation}
        />

        <MessageList messages={messages} messagesEndRef={messagesEndRef} />

        <InputBar
          input={input}
          onInputChange={setInput}
          onKeyDown={handleKeyDown}
          attachments={attachments}
          onRemoveAttachment={removeAttachment}
          onSend={handleSend}
          isRecording={isRecording}
          recordingTime={recordingTime}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          textareaRef={textareaRef}
          fileInputRef={fileInputRef}
          imageInputRef={imageInputRef}
          onFileChange={handleFiles}
        />
      </div>
    </div>
  );
}
