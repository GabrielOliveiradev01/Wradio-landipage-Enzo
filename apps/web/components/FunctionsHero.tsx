import { Sparkles } from "lucide-react";

export default function FunctionsHero() {
  return (
    <section className="relative w-full overflow-hidden bg-white pt-24 pb-16 sm:pt-32 sm:pb-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-400 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-orange-300 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-1.5 text-sm font-semibold text-orange-600 mb-6 border border-orange-100 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            <span>Ecossistema Radiológico Inteligente</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl mb-6">
            Serviços <span className="text-orange-500">WRadio</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-600 font-medium leading-relaxed">
            Uma plataforma completa desenvolvida para apoiar a rotina médica,
            otimizando desde a leitura de imagens até a entrega do laudo final.
          </p>
        </div>
      </div>
    </section>
  );
}
