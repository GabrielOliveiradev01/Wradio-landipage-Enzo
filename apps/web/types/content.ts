import type { LucideIcon } from "lucide-react";

export type NavItem = {
  name: string;
  href: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ChatFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type Slide = {
  title: string;
  image: string;
  alt: string;
};

export type PlanDefinition = {
  id: string;
  title: string;
  price: string;
  description: string;
  subtext: string;
  buttonLabel: string;
  buttonHref: string;
  buttonClasses: string;
  tone: "light" | "dark";
  features: readonly string[];
  badge?: string;
};
