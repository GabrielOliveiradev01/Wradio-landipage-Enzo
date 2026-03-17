import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { ptBr } from "@/lib/i18n";

export default function FounderSection() {
  const { badge, headingLine1, headingLine2, description, watchButton, quote } =
    ptBr.founder;

  return (
    <section className="w-full bg-white py-14 sm:py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-bold mb-6">
              <ShieldCheck className="h-4 w-4" />
              <span>{badge}</span>
            </div>

            <h2 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl mb-6">
              {headingLine1} <br className="hidden sm:block" />
              {headingLine2}
            </h2>

            <p className="hidden lg:block text-xl text-gray-600 font-medium mb-8 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex-1 w-full max-w-2xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="relative h-14 w-14 rounded-full bg-gray-100 overflow-hidden border border-gray-200 shadow-sm">
                <Image
                  src="/wagner-image.jpeg"
                  alt="Dr. Wagner Ribeiro"
                  fill
                  className="object-cover"
                  sizes="56px"
                  priority
                />
              </div>

              <div>
                <p className="text-gray-900 font-bold">Dr. Wagner Ribeiro</p>
                <p className="text-gray-500 text-sm">Médico Radiologista</p>
              </div>
            </div>

            <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-orange-50 group">
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <div className="text-center group-hover:scale-110 transition-transform duration-300">
                  <div className="h-20 w-20 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-4 cursor-pointer shadow-lg">
                    <svg
                      className="h-8 w-8 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold">{watchButton}</p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-sm text-gray-500 italic">
              &ldquo;{quote}&rdquo;
            </p>

            <div className="lg:hidden mt-8 text-center">
              <p className="text-xl text-gray-600 font-medium leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
