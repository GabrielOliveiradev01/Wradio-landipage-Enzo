"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ptBr } from "@/lib/i18n";

const t = ptBr.onboarding.welcome;

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="w-full max-w-sm">
      <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-5">
        {t.badge}
      </p>

      <h1 className="text-4xl font-bold text-gray-900 leading-[1.15] mb-5">
        {t.headingLine1}
        <br />
        {t.headingLine2}
      </h1>

      <p className="text-gray-400 text-sm leading-relaxed mb-10">
        {t.subtitle}
      </p>

      <div className="relative mb-10">
        <div className="absolute left-3 top-4 bottom-4 w-px bg-gray-100" />
        <div className="space-y-4">
          {t.journey.map((item, i) => (
            <div key={item.label} className="flex items-center gap-4 relative">
              <div
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 bg-white z-10 transition-colors"
                style={{
                  borderColor: i === 0 ? "#f97316" : "#e5e7eb",
                }}
              >
                <span
                  className="text-[9px] font-bold"
                  style={{ color: i === 0 ? "#f97316" : "#d1d5db" }}
                >
                  {i + 1}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 leading-none mb-0.5">
                  {item.label}
                </p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => router.push("/steps")}
        className="w-full py-4 rounded-2xl font-semibold text-sm text-white flex items-center justify-center gap-2.5 transition-all hover:opacity-90 active:scale-[0.98]"
        style={{ backgroundColor: "#09090b" }}
      >
        {t.startBtn}
        <ArrowRight className="w-4 h-4" />
      </button>

      <button
        onClick={() => router.push("/dashboard")}
        className="mt-3 w-full py-2.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        {t.skipBtn}
      </button>
    </div>
  );
}
