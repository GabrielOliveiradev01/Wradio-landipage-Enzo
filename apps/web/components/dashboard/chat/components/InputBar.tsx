"use client";

import { RefObject } from "react";
import { Send, Mic, Paperclip, ImageIcon, X, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatSeconds } from "../constants";
import { useDarkMode } from "@/context/DarkModeContext";

interface InputBarProps {
  input: string;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  attachments: File[];
  onRemoveAttachment: (index: number) => void;
  onSend: () => void;
  isRecording: boolean;
  recordingTime: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
  imageInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (files: FileList | null) => void;
}

export default function InputBar({
  input,
  onInputChange,
  onKeyDown,
  attachments,
  onRemoveAttachment,
  onSend,
  isRecording,
  recordingTime,
  onStartRecording,
  onStopRecording,
  textareaRef,
  fileInputRef,
  imageInputRef,
  onFileChange,
}: InputBarProps) {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={cn(
        "border-t px-4 py-3 flex-shrink-0 transition-colors duration-300",
        darkMode
          ? "border-white/10 bg-[#1c1c1e]"
          : "border-gray-200 bg-white",
      )}
    >
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {attachments.map((file, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs border",
                darkMode
                  ? "bg-zinc-800 border-white/10 text-zinc-300"
                  : "bg-gray-100 border-gray-200 text-gray-600",
              )}
            >
              <span className="max-w-[120px] truncate">{file.name}</span>
              <button
                onClick={() => onRemoveAttachment(i)}
                className={cn(
                  "flex-shrink-0 transition-colors",
                  darkMode
                    ? "text-zinc-500 hover:text-zinc-300"
                    : "text-gray-400 hover:text-gray-700",
                )}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {isRecording && (
        <div className="flex items-center gap-2 mb-2 px-1">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
          <span className="text-xs text-red-500 font-medium">
            Gravando... {formatSeconds(recordingTime)}
          </span>
        </div>
      )}

      <div className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => onFileChange(e.target.files)}
        />
        <input
          ref={imageInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => onFileChange(e.target.files)}
        />

        <div className="flex items-center gap-0.5 pb-0.5">
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Anexar arquivo"
            className={cn(
              "p-2 rounded-lg transition-colors",
              darkMode
                ? "text-zinc-500 hover:text-zinc-300 hover:bg-white/10"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
            )}
          >
            <Paperclip className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={() => imageInputRef.current?.click()}
            title="Adicionar imagem"
            className={cn(
              "p-2 rounded-lg transition-colors",
              darkMode
                ? "text-zinc-500 hover:text-zinc-300 hover:bg-white/10"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
            )}
          >
            <ImageIcon className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={isRecording ? onStopRecording : onStartRecording}
            title={isRecording ? "Parar gravação" : "Gravar áudio"}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isRecording
                ? "bg-red-50 text-red-500 hover:bg-red-100"
                : darkMode
                  ? "text-zinc-500 hover:text-zinc-300 hover:bg-white/10"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100",
            )}
          >
            {isRecording ? (
              <Square className="w-[18px] h-[18px]" />
            ) : (
              <Mic className="w-[18px] h-[18px]" />
            )}
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Digite sua mensagem... (Enter para enviar)"
          rows={1}
          className={cn(
            "flex-1 resize-none rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300 transition-all overflow-y-auto leading-relaxed",
            darkMode
              ? "border-white/10 bg-zinc-800 text-white placeholder-zinc-500"
              : "border-gray-200 text-gray-800 placeholder-gray-400",
          )}
          style={{ minHeight: "42px", maxHeight: "128px" }}
        />

        <button
          onClick={onSend}
          disabled={!input.trim() && attachments.length === 0}
          className="p-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white transition-colors flex-shrink-0 pb-[9px]"
          title="Enviar mensagem"
        >
          <Send className="w-[18px] h-[18px]" />
        </button>
      </div>

      <p
        className={cn(
          "text-[10px] mt-2 text-center",
          darkMode ? "text-zinc-600" : "text-gray-300",
        )}
      >
        Shift + Enter para nova linha · Enter para enviar
      </p>
    </div>
  );
}
