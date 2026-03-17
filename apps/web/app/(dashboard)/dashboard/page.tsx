"use client";

import Link from "next/link";
import { Zap, Clock } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import ExamsTable from "@/components/dashboard/ExamsTable";
import { useDarkMode } from "@/context/DarkModeContext";
import { useUserProfile } from "@/context/UserProfileContext";
import { cn } from "@/lib/utils";
import { ptBr } from "@/lib/i18n";

const t = ptBr.app.home;

function MiniBarChart() {
  const bars = [3, 5, 4, 7, 6];
  return (
    <div className="flex items-end gap-0.5 h-6 w-full">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 bg-orange-400 rounded-sm opacity-90"
          style={{ height: `${h * 4}px` }}
        />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { darkMode } = useDarkMode();
  const { fullName } = useUserProfile();

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-2">
            {t.badge}
          </p>
          <h1
            className={cn(
              "text-2xl md:text-3xl font-bold",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            {t.welcomePrefix} {fullName}
          </h1>
          <p
            className={cn(
              "text-sm mt-1",
              darkMode ? "text-zinc-400" : "text-gray-400",
            )}
          >
            {t.subtitle}
          </p>
        </div>
        <Link
          href="/dashboard/report-express"
          className="w-full md:w-auto mt-2 md:mt-0 py-2.5 px-5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md shadow-zinc-900/10 active:scale-[0.97] whitespace-nowrap"
          style={{ backgroundColor: "#09090b" }}
        >
          {t.reportExpressBtn}
          <Zap className="w-4 h-4 fill-orange-400 text-orange-400" />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
        <div className="flex-shrink-0 w-[260px] sm:w-auto sm:flex-1">
          <StatCard
            label={t.reportsTodayLabel}
            value="5 Laudos"
            className="h-full"
          />
        </div>
        <div className="flex-shrink-0 w-[260px] sm:w-auto sm:flex-1">
          <StatCard
            label={t.avgTimeLabel}
            value="0 Minutos"
            icon={<MiniBarChart />}
            className="h-full"
          />
        </div>
        <div className="flex-shrink-0 w-[260px] sm:w-auto sm:flex-1">
          <StatCard
            label={t.savedTimeLabel}
            value="3 Minutos"
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
      </div>

      <ExamsTable />
    </div>
  );
}
