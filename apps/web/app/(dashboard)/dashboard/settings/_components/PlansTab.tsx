"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { planDefinitions } from "@/data/content";
import { cn } from "@/lib/utils";
import PlanCard from "./PlanCard";
import { ptBr } from "@/lib/i18n";

const t = ptBr.app.settings.plans;

export default function PlansTab() {
  const [activeIndex, setActiveIndex] = useState(1);
  const totalPlans = planDefinitions.length;
  const wrapIndex = (i: number) => (i + totalPlans) % totalPlans;
  const visibleIndexes = [
    wrapIndex(activeIndex - 1),
    activeIndex,
    wrapIndex(activeIndex + 1),
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-1">
          {t.badge}
        </p>
        <h3 className="font-bold text-gray-900">{t.title}</h3>
        <p className="text-sm text-gray-400 mt-0.5">
          {t.subtitle}
        </p>
      </div>

      {/* Mobile: stack all plans */}
      <div className="md:hidden grid grid-cols-1 gap-5">
        {planDefinitions.map((plan, i) => (
          <PlanCard key={plan.id} plan={plan} active={i === 0} />
        ))}
      </div>

      {/* Desktop: carousel */}
      <div className="hidden md:flex flex-col gap-6">
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Plano anterior"
            onClick={() => setActiveIndex((prev) => wrapIndex(prev - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 shadow-sm transition hover:bg-gray-200 hover:text-gray-900 active:scale-[0.97]"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="flex items-stretch justify-center gap-5 px-2">
            {visibleIndexes.map((planIndex, slot) => {
              const plan = planDefinitions[planIndex];
              const isCenter = slot === 1;
              return (
                <PlanCard
                  key={`${plan.id}-${slot}`}
                  plan={plan}
                  active={isCenter && planIndex === 0}
                  className={cn(
                    isCenter
                      ? "w-[340px] scale-105 shadow-xl z-20"
                      : "w-[290px] scale-95 opacity-75 z-10",
                  )}
                />
              );
            })}
          </div>

          <button
            type="button"
            aria-label="Próximo plano"
            onClick={() => setActiveIndex((prev) => wrapIndex(prev + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 shadow-sm transition hover:bg-gray-200 hover:text-gray-900 active:scale-[0.97]"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        <p className="sr-only" aria-live="polite">
          {t.highlightLabel} {planDefinitions[activeIndex].title}
        </p>
      </div>
    </div>
  );
}
