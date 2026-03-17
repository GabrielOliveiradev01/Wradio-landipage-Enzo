"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { cn } from "@/lib/utils";
import { UserProfileProvider } from "@/context/UserProfileContext";
import { DarkModeProvider, useDarkMode } from "@/context/DarkModeContext";

interface DashboardShellProps {
  children: React.ReactNode;
  initialFullName: string;
  initialAvatarUrl: string | null;
}

function Inner({
  children,
  initialFullName,
  initialAvatarUrl,
}: DashboardShellProps) {
  const { darkMode } = useDarkMode();
  const [collapsed, setCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <UserProfileProvider
      initialFullName={initialFullName}
      initialAvatarUrl={initialAvatarUrl}
    >
      <div
        className={cn(
          "flex flex-col h-screen overflow-hidden transition-colors duration-300",
          darkMode ? "bg-[#1c1c1e]" : "bg-[#ebebeb]",
        )}
      >
        <TopBar
          onToggleSidebar={() => {
            if (window.innerWidth < 768) {
              setMobileMenuOpen((m) => !m);
            } else {
              setCollapsed((c) => !c);
            }
          }}
        />
        <div className="flex flex-1 overflow-hidden min-h-0 relative">
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 top-[64px] bg-black/40 z-30 md:hidden transition-opacity duration-300"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
          <Sidebar
            collapsed={collapsed}
            mobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />
          <main
            className={cn(
              "flex-1 overflow-y-auto transition-colors duration-300",
              darkMode ? "bg-[#111113]" : "bg-white",
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </UserProfileProvider>
  );
}

export default function DashboardShell(props: DashboardShellProps) {
  return (
    <DarkModeProvider>
      <Inner {...props} />
    </DarkModeProvider>
  );
}
