"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  MessageSquare,
  Star,
  Globe,
  Settings,
  UserPlus,
  Sun,
  Moon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDarkMode } from "@/context/DarkModeContext";
import { ptBr } from "@/lib/i18n";

const s = ptBr.app.sidebar;

const NAV_ITEMS = [
  { icon: LayoutDashboard, href: "/dashboard", label: s.navPanel },
  { icon: MessageSquare, href: "/dashboard/chat", label: s.navChat },
  { icon: Star, href: "/dashboard/feedback", label: s.navFeedback },
  { icon: Globe, href: "/dashboard/community", label: s.navCommunity },
  { icon: Settings, href: "/dashboard/settings", label: s.navSettings },
] as const;

interface NavItemProps {
  icon: React.ElementType;
  href: string;
  label: string;
  active: boolean;
  collapsed: boolean;
  darkMode: boolean;
  onClick?: () => void;
}

function NavItem({
  icon: Icon,
  href,
  label,
  active,
  collapsed,
  darkMode,
  onClick,
}: NavItemProps) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 py-2.5 rounded-xl transition-all duration-200 border-l-[3px]",
        collapsed
          ? "justify-center px-[calc(0.75rem-3px)]"
          : "px-[calc(0.875rem-3px)]",
        active
          ? "bg-gray-900 border-transparent text-white"
          : cn(
              "border-transparent",
              darkMode
                ? "text-zinc-400 hover:text-white hover:bg-white/10"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/60",
            ),
      )}
    >
      <Icon
        className={cn(
          "w-6 h-6 flex-shrink-0",
          active ? "text-white" : darkMode ? "text-zinc-500" : "text-gray-400",
        )}
      />
      {!collapsed && (
        <span className="text-base font-medium whitespace-nowrap">{label}</span>
      )}
    </Link>
  );
}

interface SidebarProps {
  collapsed: boolean;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <aside
      className={cn(
        "fixed md:relative flex flex-col border-r transition-all duration-300 z-40 h-[calc(100vh-64px)] md:h-auto flex-shrink-0 top-[64px] md:top-0",
        collapsed ? "md:w-[72px]" : "md:w-[280px]",
        mobileOpen
          ? "translate-x-0 w-[280px]"
          : "-translate-x-full md:translate-x-0 w-[280px]",
        darkMode
          ? "bg-[#1c1c1e] border-white/10"
          : "bg-white border-gray-200",
      )}
    >
      <div
        className={cn(
          "flex md:hidden items-center justify-between px-6 py-4 border-b",
          darkMode ? "border-white/10" : "border-gray-100",
        )}
      >
        <span
          className={cn(
            "font-bold",
            darkMode ? "text-white" : "text-gray-800",
          )}
        >
          {s.menuTitle}
        </span>
        <button onClick={onCloseMobile} className="p-1">
          <X
            className={cn(
              "w-6 h-6",
              darkMode ? "text-zinc-400" : "text-gray-500",
            )}
          />
        </button>
      </div>

      <nav className="flex-1 py-5 space-y-1 px-3">
        <button
          onClick={toggleDarkMode}
          aria-label={s.toggleTheme}
          title={s.toggleTheme}
          className={cn(
            "flex items-center gap-3 py-2.5 rounded-xl border-l-[3px] border-transparent mb-4 transition-all duration-200 w-full",
            collapsed
              ? "md:justify-center md:px-[calc(0.75rem-3px)]"
              : "px-[calc(0.875rem-3px)]",
            "justify-start px-[calc(0.875rem-3px)]",
            darkMode
              ? "text-zinc-400 hover:text-white hover:bg-white/10"
              : "text-gray-500 hover:text-gray-800 hover:bg-white/60",
          )}
        >
          {darkMode ? (
            <Sun className="w-6 h-6 flex-shrink-0 text-zinc-400" />
          ) : (
            <Moon className="w-6 h-6 flex-shrink-0 text-gray-400" />
          )}
          {(!collapsed || mobileOpen) && (
            <span className="text-base font-medium whitespace-nowrap">
              {s.toggleTheme}
            </span>
          )}
        </button>

        {NAV_ITEMS.map(({ icon, href, label }) => (
          <NavItem
            key={href}
            icon={icon}
            href={href}
            label={label}
            active={pathname === href}
            collapsed={collapsed && !mobileOpen}
            darkMode={darkMode}
            onClick={onCloseMobile}
          />
        ))}
      </nav>

      <div className={cn("px-3 pb-5", collapsed && !mobileOpen && "md:px-2")}>
        {(!collapsed || mobileOpen) && (
          <>
            <div
              className={cn(
                "w-full h-5 rounded-full border-2 overflow-hidden mb-1.5",
                darkMode
                  ? "border-white/10 bg-white/5"
                  : "border-gray-200 bg-gray-50",
              )}
            >
              <div
                className="h-full bg-orange-400 rounded-full flex items-center justify-end pr-1"
                style={{ width: "2%" }}
              />
            </div>
            <div className="flex items-center gap-1.5 px-0.5">
              <UserPlus
                className={cn(
                  "w-3.5 h-3.5 flex-shrink-0",
                  darkMode ? "text-zinc-500" : "text-gray-500",
                )}
              />
              <span
                className={cn(
                  "text-[11px] font-medium",
                  darkMode ? "text-zinc-500" : "text-gray-500",
                )}
              >
                {s.referral}
              </span>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
