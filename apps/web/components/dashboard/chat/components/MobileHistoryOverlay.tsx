"use client";

import { X } from "lucide-react";
import { Conversation } from "../types";
import HistorySidebar from "./HistorySidebar";

interface MobileHistoryOverlayProps {
  open: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewConversation: () => void;
}

export default function MobileHistoryOverlay({
  open,
  onClose,
  conversations,
  activeId,
  onSelect,
  onNewConversation,
}: MobileHistoryOverlayProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-20 md:hidden"
        onClick={onClose}
      />
      <div className="fixed left-0 top-0 bottom-0 w-[280px] z-30 md:hidden shadow-xl">
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <span className="font-semibold text-sm text-gray-700">Histórico</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="h-[calc(100%-52px)]">
          <HistorySidebar
            mobile
            conversations={conversations}
            activeId={activeId}
            onSelect={(id) => {
              onSelect(id);
              onClose();
            }}
            onNewConversation={() => {
              onNewConversation();
              onClose();
            }}
          />
        </div>
      </div>
    </>
  );
}
