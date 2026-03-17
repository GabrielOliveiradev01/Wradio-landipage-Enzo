import {
  ClipboardCheck,
  MessageCircle,
  Search,
  Stethoscope,
} from "lucide-react";
import { ptBr } from "@/lib/i18n";
import type {
  ChatFeature,
  FaqItem,
  NavItem,
  PlanDefinition,
  Slide,
} from "@/types/content";

export const navItems: NavItem[] = ptBr.navbar.navItems;
export const faqs: FaqItem[] = ptBr.faq.items;
export const slides: Slide[] = ptBr.reportExpress.slides;
export const sliderMinSwipeDistance = ptBr.reportExpress.sliderMinSwipeDistance;
export const modalitiesList = ptBr.modalities.list;

const icons = [Search, ClipboardCheck, Stethoscope, MessageCircle];
export const chatFeatures: ChatFeature[] = ptBr.helpChat.features.map(
  (feature, index) => ({
    icon: icons[index % icons.length],
    title: feature.title,
    description: feature.description,
  }),
);

export const planDefinitions: PlanDefinition[] = ptBr.plans.planDefinitions;
