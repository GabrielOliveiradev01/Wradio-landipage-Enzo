"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Zap, Menu, Settings, LogOut } from "lucide-react";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useUserProfile } from "@/context/UserProfileContext";
import { useDarkMode } from "@/context/DarkModeContext";
import { ptBr } from "@/lib/i18n";

const t = ptBr.app.topbar;

interface TopBarProps {
  onToggleSidebar?: () => void;
  tokens?: number;
}

export default function TopBar({
  onToggleSidebar,
  tokens = 1240,
}: TopBarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { avatarUrl, fullName } = useUserProfile();
  const { darkMode } = useDarkMode();

  const handleSignOut = async () => {
    setProfileOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        "h-16 flex items-center justify-between px-6 border-b flex-shrink-0 transition-colors duration-300 relative z-50",
        darkMode
          ? "bg-[#1c1c1e] border-white/10 text-white"
          : "bg-white border-gray-200",
      )}
    >
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={onToggleSidebar}
          title={t.toggleMenuTitle}
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-lg transition-colors",
            darkMode
              ? "text-zinc-400 hover:text-white hover:bg-white/10"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/60",
          )}
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/dashboard">
          <Image
            src="/wradio-logo-v2.png"
            alt="Wradio"
            width={110}
            height={28}
            className="h-7 w-auto object-contain"
            unoptimized
          />
        </Link>

        <Link
          href="/dashboard/report-express"
          className="hidden md:flex items-center justify-center gap-2 text-white px-5 py-2 rounded-full font-semibold text-sm hover:opacity-90 active:scale-[0.97] transition-all shadow-md shadow-zinc-900/10"
          style={{ backgroundColor: "#09090b" }}
        >
          {t.reportExpressBtn}
          <Zap className="w-4 h-4 fill-orange-400 text-orange-400" />
        </Link>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <Link
          href="/planos"
          title={t.addTokensTitle}
          className={cn(
            "flex md:hidden items-center gap-1 rounded-full border px-3 py-1 transition-colors",
            darkMode
              ? "border-white/15 bg-white/5"
              : "border-gray-300 bg-white/70",
          )}
        >
          <Zap
            className={cn(
              "w-3.5 h-3.5",
              darkMode ? "text-orange-400" : "text-orange-500",
            )}
          />
          <span
            className={cn(
              "text-xs font-semibold tabular-nums",
              darkMode ? "text-white" : "text-gray-800",
            )}
          >
            {tokens.toLocaleString("pt-BR")}
          </span>
        </Link>

        <div
          className={cn(
            "hidden md:flex items-center gap-1 rounded-full border pr-1 pl-3 py-1 transition-colors",
            darkMode
              ? "border-white/15 bg-white/5"
              : "border-gray-300 bg-white/70",
          )}
        >
          <Zap
            className={cn(
              "w-3.5 h-3.5",
              darkMode ? "text-orange-400" : "text-orange-500",
            )}
          />
          <span
            className={cn(
              "text-sm font-semibold tabular-nums",
              darkMode ? "text-white" : "text-gray-800",
            )}
          >
            {tokens.toLocaleString("pt-BR")}
          </span>
          <span
            className={cn(
              "text-xs",
              darkMode ? "text-zinc-400" : "text-gray-500",
            )}
          >
            {t.tokensLabel}
          </span>
          <Link
            href="/planos"
            title={t.addTokensTitle}
            className="ml-1 w-6 h-6 flex items-center justify-center rounded-full text-white hover:opacity-90 active:scale-[0.97] transition-all shadow-sm"
            style={{ backgroundColor: "#09090b" }}
          >
            <Plus className="w-3.5 h-3.5" />
          </Link>
        </div>

<div className="relative" ref={profileRef}>
          <button
            title={t.profileTitle}
            onClick={() => setProfileOpen((v) => !v)}
            className={cn(
              "w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-800 text-white text-xs font-bold flex items-center justify-center ring-2 transition-colors overflow-hidden",
              profileOpen
                ? "ring-gray-900"
                : darkMode
                  ? "ring-white/20 hover:ring-white/40"
                  : "ring-gray-200 hover:ring-gray-900",
            )}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={t.profileTitle}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{getInitials(fullName) || "?"}</span>
            )}
          </button>

          {profileOpen && (
            <div
              className={cn(
                "absolute right-0 top-[calc(100%+8px)] w-44 rounded-xl border shadow-lg overflow-hidden z-50",
                darkMode
                  ? "bg-[#2c2c2e] border-white/10 text-white"
                  : "bg-white border-gray-200 text-gray-800",
              )}
            >
              <Link
                href="/dashboard/settings"
                onClick={() => setProfileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors",
                  darkMode ? "hover:bg-white/10" : "hover:bg-gray-50",
                )}
              >
                <Settings className="w-4 h-4 text-orange-500" />
                {t.settingsLink}
              </Link>
              <div
                className={cn("h-px", darkMode ? "bg-white/10" : "bg-gray-100")}
              />
              <button
                onClick={handleSignOut}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors",
                  darkMode
                    ? "hover:bg-white/10 text-red-400"
                    : "hover:bg-red-50 text-red-500",
                )}
              >
                <LogOut className="w-4 h-4" />
                {t.signOutBtn}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
