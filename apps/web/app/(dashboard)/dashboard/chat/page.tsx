"use client";

import { useState } from "react";
import {
  MessageSquare,
  Stethoscope,
  Clock,
  FileText,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import ChatInterface from "@/components/dashboard/chat/ChatInterface";
import { useDarkMode } from "@/context/DarkModeContext";
import { cn } from "@/lib/utils";
import { ptBr } from "@/lib/i18n";

const t = ptBr.app.chat;

const QUICK_PROMPT_ICONS = [FileText, HelpCircle, Clock];

const QUICK_PROMPTS = t.quickPrompts.map((p, i) => ({
  ...p,
  icon: QUICK_PROMPT_ICONS[i],
}));

export default function ChatPage() {
  const [started, setStarted] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<string | undefined>();
  const { darkMode } = useDarkMode();

  if (started) {
    return (
      <div className="h-full flex flex-col">
        <ChatInterface initialPrompt={initialPrompt} />
      </div>
    );
  }

  const handleStart = (prompt?: string) => {
    setInitialPrompt(prompt);
    setStarted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <div className="flex flex-col items-center text-center w-full max-w-md gap-10">

        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "w-14 h-14 rounded-xl border flex items-center justify-center shadow-sm",
              darkMode ? "bg-zinc-900 border-white/10" : "bg-white border-gray-100",
            )}
          >
            <Stethoscope className="w-6 h-6 text-orange-500" strokeWidth={1.75} />
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-3">
              {t.badge}
            </p>
            <h1
              className={cn(
                "text-3xl font-bold leading-snug mb-2",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              {t.headingLine1}
              <br />
              {t.headingLine2}
            </h1>
            <p
              className={cn(
                "text-sm leading-relaxed max-w-xs mx-auto",
                darkMode ? "text-zinc-400" : "text-gray-400",
              )}
            >
              {t.subtitle}
            </p>
          </div>
        </div>

        <div className="space-y-2 w-full">
          {QUICK_PROMPTS.map(({ icon: Icon, label, sublabel, prompt }) => (
            <button
              key={label}
              onClick={() => handleStart(prompt)}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition-all duration-200 active:scale-[0.99] group",
                darkMode
                  ? "border-white/10 bg-zinc-900 hover:border-white/20 hover:bg-zinc-800"
                  : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white",
              )}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-xl border flex items-center justify-center shrink-0",
                  darkMode ? "bg-zinc-800 border-white/10" : "bg-white border-gray-100",
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 group-hover:text-orange-400 transition-colors",
                    darkMode ? "text-zinc-500" : "text-gray-400",
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium leading-none mb-1",
                    darkMode ? "text-zinc-200" : "text-gray-800",
                  )}
                >
                  {label}
                </p>
                <p
                  className={cn(
                    "text-xs leading-tight",
                    darkMode ? "text-zinc-500" : "text-gray-400",
                  )}
                >
                  {sublabel}
                </p>
              </div>
              <ArrowRight
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  darkMode
                    ? "text-zinc-600 group-hover:text-zinc-400"
                    : "text-gray-300 group-hover:text-gray-400",
                )}
              />
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 w-full -mt-4">
          <button
            onClick={() => handleStart()}
            className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all active:scale-[0.97] shadow-md shadow-zinc-900/10"
            style={{ backgroundColor: "#09090b" }}
          >
            <MessageSquare className="w-4 h-4" />
            {t.startBtn}
          </button>
          <p
            className={cn(
              "text-xs",
              darkMode ? "text-zinc-600" : "text-gray-300",
            )}
          >
            {t.autoSaveHint}
          </p>
        </div>

      </div>
    </div>
  );
}
