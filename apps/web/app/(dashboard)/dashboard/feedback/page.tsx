"use client";

import { useState } from "react";
import { Mail, Send, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDarkMode } from "@/context/DarkModeContext";
import { createClient } from "@/lib/supabase/client";
import { ptBr } from "@/lib/i18n";

const t = ptBr.app.feedback;

const MAX_CHARS = 500;

export default function FeedbacksPage() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { darkMode } = useDarkMode();

  const canSubmit = message.trim().length > 0 && !loading;
  const remaining = MAX_CHARS - message.length;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const { error: fnError } = await supabase.functions.invoke("send-feedback", {
        body: { message: message.trim() },
        headers: session ? { Authorization: `Bearer ${session.access_token}` } : undefined,
      });

      if (fnError) throw fnError;

      setSent(true);
      setMessage("");
    } catch (err) {
      console.error(err);
      setError(t.sendError);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full px-4">
        <div className="flex flex-col items-center text-center gap-4 max-w-sm">
          <div
            className={cn(
              "w-14 h-14 rounded-xl border flex items-center justify-center shadow-sm",
              darkMode
                ? "bg-zinc-900 border-white/10"
                : "bg-white border-gray-100",
            )}
          >
            <Check className="w-6 h-6 text-orange-500" />
          </div>
          <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase">
            {t.successBadge}
          </p>
          <h2
            className={cn(
              "text-2xl font-bold leading-snug",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            {t.successHeading}
          </h2>
          <p
            className={cn(
              "text-sm leading-relaxed",
              darkMode ? "text-zinc-400" : "text-gray-400",
            )}
          >
            {t.successSubtitle}
          </p>
          <button
            onClick={() => setSent(false)}
            className={cn(
              "mt-2 text-sm font-medium transition-colors",
              darkMode
                ? "text-zinc-500 hover:text-zinc-300"
                : "text-gray-400 hover:text-gray-700",
            )}
          >
            {t.sendAnotherBtn}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 py-8">
      <div className="flex flex-col w-full max-w-md gap-8">
        <div className="flex flex-col items-center text-center gap-4">
          <div
            className={cn(
              "w-14 h-14 rounded-xl border flex items-center justify-center shadow-sm",
              darkMode
                ? "bg-zinc-900 border-white/10"
                : "bg-white border-gray-100",
            )}
          >
            <Mail className="w-6 h-6 text-orange-500" strokeWidth={1.75} />
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
              {t.heading}
            </h1>
            <p
              className={cn(
                "text-sm leading-relaxed",
                darkMode ? "text-zinc-400" : "text-gray-400",
              )}
            >
              {t.subtitle}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "flex items-center gap-4 px-5 py-4 rounded-2xl border",
            darkMode
              ? "border-white/10 bg-zinc-900"
              : "border-gray-100 bg-gray-50",
          )}
        >
          <div
            className={cn(
              "w-10 h-10 rounded-full border flex items-center justify-center shrink-0 text-base font-bold shadow-sm",
              darkMode
                ? "bg-zinc-800 border-white/10 text-zinc-400"
                : "bg-white border-gray-100 text-gray-400",
            )}
          >
            W
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "text-sm font-medium leading-none mb-1",
                darkMode ? "text-zinc-200" : "text-gray-800",
              )}
            >
              {t.founderName}
            </p>
            <p
              className={cn(
                "text-xs",
                darkMode ? "text-zinc-500" : "text-gray-400",
              )}
            >
              {t.founderSubtitle}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Clock
              className={cn(
                "w-3 h-3",
                darkMode ? "text-zinc-600" : "text-gray-300",
              )}
            />
            <span
              className={cn(
                "text-xs",
                darkMode ? "text-zinc-600" : "text-gray-300",
              )}
            >
              ~48h
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS)
                  setMessage(e.target.value);
              }}
              placeholder={t.placeholder}
              rows={5}
              className={cn(
                "w-full rounded-2xl border px-5 py-4 text-sm resize-none focus:outline-none focus:ring-2 focus:border-transparent transition",
                darkMode
                  ? "border-white/10 bg-zinc-900 text-white placeholder-zinc-500 focus:ring-white/20"
                  : "border-gray-200 bg-white text-gray-700 placeholder-gray-300 focus:ring-gray-900",
              )}
            />
            <span
              className={cn(
                "absolute bottom-3 right-4 text-xs transition-colors",
                remaining < 50
                  ? "text-orange-400"
                  : darkMode
                    ? "text-zinc-600"
                    : "text-gray-300",
              )}
            >
              {remaining}
            </span>
          </div>

          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={cn(
              "flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold transition-all active:scale-[0.97] shadow-md shadow-zinc-900/10",
              canSubmit
                ? "text-white hover:opacity-90"
                : darkMode
                  ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                  : "bg-gray-100 text-gray-300 cursor-not-allowed",
            )}
            style={canSubmit ? { backgroundColor: "#09090b" } : undefined}
          >
            <Send className={cn("w-4 h-4", loading && "animate-pulse")} />
            {loading ? t.loadingBtn : t.submitBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
