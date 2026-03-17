"use client";

import { useEffect } from "react";
import { X, Star, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDarkMode } from "@/context/DarkModeContext";

export interface UserProfile {
  name: string;
  initials: string;
  color: string;
  specialty?: string | null;
  crm?: string | null;
  // Stats detalhadas (perfis enriquecidos/mockados)
  reportsWithAI?: number;
  reportTime?: string;
  timeSaved?: string;
  featuredReports?: {
    title: string;
    type: string;
    date: string;
  }[];
  // Stats derivadas do feed
  messagesInChannel?: number;
}

interface UserProfileModalProps {
  profile: UserProfile;
  onClose: () => void;
}

function StatCard({
  label,
  value,
  accent,
  darkMode,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
  darkMode: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 shadow-sm flex-1 min-w-[140px]",
        accent
          ? "bg-orange-500/10 border border-orange-500/30"
          : darkMode
            ? "bg-zinc-800 border border-white/10"
            : "bg-gray-50 border border-gray-200",
      )}
    >
      <p
        className={cn(
          "text-sm mb-2",
          darkMode ? "text-zinc-400" : "text-gray-500",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "text-2xl font-bold",
          accent
            ? "text-orange-500"
            : darkMode
              ? "text-white"
              : "text-gray-900",
        )}
      >
        {value}
      </p>
    </div>
  );
}

export default function UserProfileModal({
  profile,
  onClose,
}: UserProfileModalProps) {
  const { darkMode } = useDarkMode();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      <div
        className={cn(
          "relative z-10 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden transition-colors",
          darkMode ? "bg-zinc-900" : "bg-white",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="h-32 w-full"
          style={{ background: "linear-gradient(135deg, #f97316, #fb923c)" }}
        />

        <button
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4 w-8 h-8 rounded-full backdrop-blur flex items-center justify-center transition-colors shadow-sm",
            darkMode
              ? "bg-zinc-800/80 text-zinc-400 hover:text-white"
              : "bg-white/80 text-gray-500 hover:text-gray-800",
          )}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="absolute top-12 left-6">
          <div
            className={cn(
              "w-[72px] h-[72px] rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4",
              profile.color,
              darkMode ? "border-zinc-900" : "border-white",
            )}
          >
            {profile.initials}
          </div>
        </div>

        <div className="px-8 pt-14 pb-8 space-y-7">
          <div>
            <h2
              className={cn(
                "text-2xl font-bold leading-tight",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              {profile.name}
            </h2>
            {(profile.specialty || profile.crm) && (
              <p
                className={cn(
                  "text-sm mt-0.5",
                  darkMode ? "text-zinc-400" : "text-gray-500",
                )}
              >
                {[profile.specialty, profile.crm ? `CRM ${profile.crm}` : null]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>

          {profile.reportsWithAI !== undefined ? (
            <div className="flex flex-wrap gap-4">
              <StatCard
                label="Laudos com IA"
                value={`${profile.reportsWithAI} Laudos`}
                accent
                darkMode={darkMode}
              />
              <StatCard
                label="Tempo de laudagem"
                value={profile.reportTime!}
                darkMode={darkMode}
              />
              <StatCard
                label="Tempo economizado"
                value={profile.timeSaved!}
                darkMode={darkMode}
              />
            </div>
          ) : profile.messagesInChannel !== undefined ? (
            <div className="flex flex-wrap gap-4">
              <StatCard
                label="Mensagens no canal"
                value={String(profile.messagesInChannel)}
                accent
                darkMode={darkMode}
              />
            </div>
          ) : null}

          {(profile.featuredReports?.length ?? 0) > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-orange-400" />
                <span
                  className={cn(
                    "text-sm font-semibold",
                    darkMode ? "text-zinc-300" : "text-gray-700",
                  )}
                >
                  Laudos destacados
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {profile.featuredReports!.map((laudo, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 rounded-2xl border cursor-pointer shadow-sm transition-colors",
                      darkMode
                        ? "border-white/10 bg-zinc-800 hover:border-orange-500/40 hover:bg-orange-500/10"
                        : "border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/60",
                    )}
                  >
                    <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FileText className="w-4 h-4 text-orange-500" />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "text-xs font-semibold leading-snug line-clamp-2",
                          darkMode ? "text-zinc-200" : "text-gray-800",
                        )}
                      >
                        {laudo.title}
                      </p>
                      <p
                        className={cn(
                          "text-[11px] mt-1",
                          darkMode ? "text-zinc-500" : "text-gray-400",
                        )}
                      >
                        {laudo.type} · {laudo.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
