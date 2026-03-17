"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { planDefinitions } from "@/data/content";
import type { PlanDefinition } from "@/types/content";
import { ptBr } from "@/lib/i18n";

type PlanCardProps = {
  plan: PlanDefinition;
  className?: string;
};

function PlanCard({ plan, className }: PlanCardProps) {
  const primaryText = plan.tone === "dark" ? "text-white" : "text-gray-900";
  const secondaryText =
    plan.tone === "dark" ? "text-gray-300" : "text-gray-600";
  const iconColor =
    plan.tone === "dark" ? "text-orange-400" : "text-orange-500";

  return (
    <article
      className={`rounded-[2rem] p-8 xl:p-10 flex flex-col ring-1 shadow-sm transition-transform duration-300 ${
        plan.tone === "dark"
          ? "bg-gray-900 ring-white/10 text-white"
          : "bg-white ring-gray-200 text-gray-900"
      } ${className ?? ""}`}
    >
      {plan.badge && (
        <span className="mb-4 inline-flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white shadow-sm w-fit">
          <Star className="h-3 w-3 fill-white text-white" />
          {plan.badge}
        </span>
      )}

      <h3 className={`text-3xl font-semibold ${primaryText}`}>{plan.title}</h3>

      <p className="mt-6 flex items-baseline gap-x-1">
        <span
          className={`text-4xl font-semibold tracking-tight ${primaryText}`}
        >
          {plan.price}
        </span>
      </p>

      <div className="mt-4">
        <p className={`text-lg font-semibold ${primaryText}`}>
          {plan.description}
        </p>
        <p className={`text-sm ${secondaryText}`}>{plan.subtext}</p>
      </div>

      <Link
        href={plan.buttonHref}
        className={`mt-6 block rounded-[1.5rem] px-3 py-2.5 text-center text-sm font-semibold shadow-sm transition-colors ${plan.buttonClasses}`}
      >
        {plan.buttonLabel}
      </Link>

      <ul
        className={`mt-8 space-y-3 text-sm ${plan.tone === "dark" ? "text-white" : "text-gray-600"} flex-1`}
      >
        {plan.features.map((feature: string) => (
          <li key={feature} className="flex gap-x-3">
            <Check className={`h-5 w-5 ${iconColor}`} />
            <span
              className={`${plan.tone === "dark" ? "text-white" : "text-gray-600"}`}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function PlansSection() {
  const [activePlanIndex, setActivePlanIndex] = useState(1);
  const { title, description } = ptBr.plans;
  const { previousPlan, nextPlan } = ptBr.aria;
  const totalPlans = planDefinitions.length;
  const wrapIndex = (index: number) => (index + totalPlans) % totalPlans;
  const visibleIndexes = [
    wrapIndex(activePlanIndex - 1),
    activePlanIndex,
    wrapIndex(activePlanIndex + 1),
  ];

  return (
    <section className="py-24 sm:py-20 relative overflow-hidden" id="plans">
      <div className="absolute inset-0 z-0 hidden md:block bg-orange-500" />

      <div className="absolute inset-0 z-0 block md:hidden">
        <Image
          src="/IMG_3582.JPG"
          alt="Wradio Background Mobile"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mt-2 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {title}
          </p>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-center text-lg/8 text-white">
          {description}
        </p>

        <div className="md:hidden">
          <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 lg:mx-0 lg:max-w-none md:grid-cols-2 xl:grid-cols-4 lg:gap-x-8 lg:gap-y-8 xl:gap-y-0">
            {planDefinitions.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                className="shadow-sm hover:shadow-md transition-shadow"
              />
            ))}
          </div>
        </div>

        <div className="hidden md:flex mt-10 flex-col gap-6">
          <div className="flex items-center justify-center gap-6">
            <button
              type="button"
              aria-label={previousPlan}
              onClick={() => setActivePlanIndex((prev) => wrapIndex(prev - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white shadow-sm shadow-black/40 backdrop-blur transition hover:bg-white/20"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <div className="flex items-stretch justify-center gap-6 px-4">
              {visibleIndexes.map((planIndex, slot) => {
                const plan = planDefinitions[planIndex];
                const slotClass =
                  slot === 1
                    ? "md:w-[360px] lg:w-[380px] scale-105 shadow-2xl z-20"
                    : "md:w-[320px] lg:w-[340px] scale-95 opacity-80 z-10";

                return (
                  <PlanCard
                    key={`${plan.id}-${slot}`}
                    plan={plan}
                    className={slotClass}
                  />
                );
              })}
            </div>

            <button
              type="button"
              aria-label={nextPlan}
              onClick={() => setActivePlanIndex((prev) => wrapIndex(prev + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white shadow-sm shadow-black/40 backdrop-blur transition hover:bg-white/20"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          Plano em destaque: {planDefinitions[activePlanIndex].title}
        </p>
      </div>
    </section>
  );
}
