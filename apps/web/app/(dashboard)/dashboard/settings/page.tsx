"use client";

import { useState } from "react";
import { User, Shield, CreditCard, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import AccountTab from "./_components/AccountTab";
import SecurityTab from "./_components/SecurityTab";
import PlansTab from "./_components/PlansTab";
import PrivacyTab from "./_components/PrivacyTab";
import { useDarkMode } from "@/context/DarkModeContext";
import { ptBr } from "@/lib/i18n";

const t = ptBr.app.settings;

type Tab = "account" | "security" | "plans" | "privacy";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "account", label: t.tabAccount, icon: User },
  { id: "security", label: t.tabSecurity, icon: Shield },
  { id: "plans", label: t.tabPlans, icon: CreditCard },
  { id: "privacy", label: t.tabPrivacy, icon: Lock },
];

const TAB_CONTENT: Record<Tab, React.ReactNode> = {
  account: <AccountTab />,
  security: <SecurityTab />,
  plans: <PlansTab />,
  privacy: <PrivacyTab />,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("account");
  const { darkMode } = useDarkMode();

  return (
    <div className="relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-orange-500/[0.03] blur-3xl" />
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-orange-400/[0.05] blur-3xl" />
      </div>

      <div className="relative z-10 px-4 sm:px-8 py-8 max-w-4xl w-full mx-auto">
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-3">
            {t.badge}
          </p>
          <h1
            className={cn(
              "text-3xl font-bold leading-snug",
              darkMode ? "text-white" : "text-gray-900",
            )}
          >
            {t.heading}
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

        <div
          className={cn(
            "flex overflow-x-auto border-b mb-8 scrollbar-none",
            darkMode ? "border-white/10" : "border-gray-100",
          )}
        >
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-2 px-4 sm:px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all duration-200 border-b-2 -mb-px shrink-0 flex-shrink-0",
                activeTab === id
                  ? darkMode
                    ? "border-white text-white"
                    : "border-gray-900 text-gray-900"
                  : darkMode
                    ? "border-transparent text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
                    : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-200",
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <div>{TAB_CONTENT[activeTab]}</div>
      </div>
    </div>
  );
}
