"use client";

import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlanDefinition } from "@/types/content";

interface PlanCardProps {
  plan: PlanDefinition;
  active?: boolean;
  className?: string;
}

export default function PlanCard({ plan, active, className }: PlanCardProps) {
  const primaryText = plan.tone === "dark" ? "text-white" : "text-gray-900";
  const secondaryText =
    plan.tone === "dark" ? "text-gray-300" : "text-gray-600";
  const iconColor =
    plan.tone === "dark" ? "text-orange-400" : "text-orange-500";

  return (
    <article
      className={cn(
        "rounded-[2rem] p-7 flex flex-col ring-1 shadow-sm transition-all duration-300",
        plan.tone === "dark"
          ? "bg-gray-900 ring-white/10 text-white"
          : "bg-white ring-gray-200 text-gray-900",
        active && "ring-2 ring-orange-500 shadow-lg shadow-orange-500/15",
        className,
      )}
    >
      {plan.badge && (
        <span className="mb-4 inline-flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white shadow-sm w-fit">
          <Star className="h-3 w-3 fill-white text-white" />
          {plan.badge}
        </span>
      )}

      {active && (
        <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 w-fit">
          <Check className="h-3 w-3" />
          Plano atual
        </span>
      )}

      <h3 className={cn("text-2xl font-semibold", primaryText)}>
        {plan.title}
      </h3>

      <p className="mt-4 flex items-baseline gap-x-1">
        <span
          className={cn("text-3xl font-semibold tracking-tight", primaryText)}
        >
          {plan.price}
        </span>
      </p>

      <div className="mt-3">
        <p className={cn("text-base font-semibold", primaryText)}>
          {plan.description}
        </p>
        <p className={cn("text-sm", secondaryText)}>{plan.subtext}</p>
      </div>

      <a
        href={plan.buttonHref}
        className={cn(
          "mt-5 block rounded-[1.5rem] px-3 py-2.5 text-center text-sm font-semibold shadow-sm transition-colors",
          plan.buttonClasses,
        )}
      >
        {plan.buttonLabel}
      </a>

      <ul
        className={cn(
          "mt-6 space-y-2.5 text-sm flex-1",
          plan.tone === "dark" ? "text-white" : "text-gray-600",
        )}
      >
        {plan.features.map((feature: string) => (
          <li key={feature} className="flex gap-x-3">
            <Check className={cn("h-5 w-5 flex-shrink-0", iconColor)} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
