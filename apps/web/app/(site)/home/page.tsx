import type { Metadata } from "next";
import HeroSection from "../../../components/HeroSection";
import ReportExpressSection from "../../../components/ReportExpressSection";
import ReportStepsSection from "../../../components/ReportStepsSection";
import DoctorComparisonSection from "../../../components/DoctorComparisonSection";
import FaqSection from "../../../components/FaqSection";
import HelpChatSection from "../../../components/HelpChatSection";
import ModalitiesSection from "../../../components/ModalitiesSection";
import PlansSection from "../../../components/PlansSection";
import FounderSection from "../../../components/FounderSection";
import Footer from "../../../components/Footer";
import { createPageMetadata } from "../../../config/seo.config";

export const metadata: Metadata = createPageMetadata({
  title: "Home - Laudos Radiológicos Inteligentes",
  description: "Transforme seu fluxo de trabalho médico com laudos radiológicos inteligentes. Tecnologia de ponta, rapidez e precisão para profissionais da saúde.",
  path: "/home",
  keywords: [
    "laudos radiológicos",
    "radiologia inteligente",
    "diagnóstico por imagem",
    "telemedicina",
    "laudos médicos online",
    "sistema de laudos",
    "IA em radiologia",
  ],
});

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div id="hero">
        <HeroSection />
      </div>

      <div id="services" className="scroll-mt-10">
        <ReportStepsSection />
      </div>

      <div>
        <ReportExpressSection />
      </div>

      <div id="wradio">
        <FounderSection />
      </div>

      <div>
        <ModalitiesSection />
      </div>

      <div id="doctor-comparison">
        <DoctorComparisonSection />
      </div>

      <div id="plans">
        <PlansSection />
      </div>

      <div id="faq">
        <HelpChatSection />
        <FaqSection />
      </div>

      <Footer />
    </div>
  );
}
