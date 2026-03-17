"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, TrendingUp, AlertCircle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import StatCard from "@/components/dashboard/StatCard";
import { useDarkMode } from "@/context/DarkModeContext";
import { ptBr } from "@/lib/i18n";

const t = ptBr.app.reportExpress;

function LightningIcon() {
  return (
    <div className="relative w-14 h-14">
      <div className="absolute inset-0 rounded-2xl bg-orange-500/20 blur-md" />
      <div className="relative w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center ring-4 ring-orange-500/10">
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 2L4.5 13.5H12L11 22L19.5 10.5H12L13 2Z"
            fill="white"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

export default function ReportExpressPage() {
  const [showTimer, setShowTimer] = useState(true);
  const router = useRouter();
  const { darkMode } = useDarkMode();

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          <LightningIcon />
          <div>
            <h1
              className={cn(
                "text-2xl md:text-3xl font-bold",
                darkMode ? "text-white" : "text-gray-900",
              )}
            >
              {t.title}
            </h1>
            <p
              className={cn(
                "text-sm mt-1",
                darkMode ? "text-zinc-400" : "text-gray-500",
              )}
            >
              {t.indexSubtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-none pb-1">
        <div className="flex-shrink-0 w-[260px] sm:w-auto sm:flex-1">
          <StatCard
            label={t.reportsTodayLabel}
            value="5 Laudos"
            icon={
              <Clock
                className={cn(
                  "w-5 h-5",
                  darkMode ? "text-zinc-400" : "text-gray-400",
                )}
              />
            }
            className="h-full"
          />
        </div>
        <div className="flex-shrink-0 w-[260px] sm:w-auto sm:flex-1">
          <StatCard
            label={t.thisMonthLabel}
            value="42 Laudos"
            icon={
              <TrendingUp
                className={cn(
                  "w-5 h-5",
                  darkMode ? "text-zinc-400" : "text-gray-400",
                )}
              />
            }
            className="h-full"
          />
        </div>
        <div className="flex-shrink-0 w-[260px] sm:w-auto sm:flex-1">
          <StatCard
            label={t.pendingReportsLabel}
            value="12 Laudos"
            icon={<AlertCircle className="w-5 h-5 text-amber-400" />}
            className="h-full"
          />
        </div>
      </div>

      <div
        className={cn(
          "border rounded-2xl p-5 shadow-sm flex items-center justify-between",
          darkMode
            ? "bg-zinc-900 border-white/10"
            : "bg-gray-50 border-gray-200",
        )}
      >
        <div>
          <p
            className={cn(
              "text-sm font-medium",
              darkMode ? "text-zinc-200" : "text-gray-700",
            )}
          >
            {t.timerVisibleLabel}
          </p>
          <p
            className={cn(
              "text-xs mt-0.5",
              darkMode ? "text-zinc-500" : "text-gray-400",
            )}
          >
            {t.timerVisibleSubtitle}
          </p>
        </div>
        <button
          role="switch"
          aria-checked={showTimer}
          onClick={() => setShowTimer((v) => !v)}
          className={cn(
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-300 focus:outline-none",
            showTimer ? "bg-orange-500" : darkMode ? "bg-zinc-700" : "bg-gray-200",
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-5 w-5 mt-0.5 rounded-full bg-white shadow-md transition-transform duration-300",
              showTimer ? "translate-x-[22px]" : "translate-x-0.5",
            )}
          />
        </button>
      </div>

      <button
        onClick={() => router.push("/dashboard/report-express/session")}
        className="py-3 px-6 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-semibold text-sm rounded-xl inline-flex items-center gap-2 transition-all duration-150 shadow-sm"
      >
        {t.startSessionBtn}
        <Zap className="w-4 h-4 fill-white" />
      </button>
    </div>
  );
}
