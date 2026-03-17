import { modalitiesList } from "@/data/content";
import { ptBr } from "@/lib/i18n";

export default function ModalitiesSection() {
  const { titleBefore, titleHighlight, titleAfter } = ptBr.modalities;
  return (
    <section className="w-full bg-black py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            {titleBefore} <span className="text-orange-500">{titleHighlight}</span>{" "}
            {titleAfter}
          </h2>
        </div>

        <div className="bg-zinc-900/50 rounded-[2.5rem] border border-zinc-800 p-8 sm:p-12 lg:p-16 shadow-sm max-w-4xl mx-auto flex justify-center">
          <ul className="relative flex flex-col gap-y-5 sm:gap-y-6 w-full max-w-lg">
            <div className="absolute left-[4px] top-[14px] sm:top-[16px] bottom-[14px] sm:bottom-[16px] w-0.5 bg-zinc-800 z-0" />

            {modalitiesList.map((item, idx) => (
              <li
                key={idx}
                className="relative z-10 flex items-center gap-3 sm:gap-4 text-zinc-300 font-medium text-sm sm:text-xl"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 flex-shrink-0 mt-0.5" />
                <span className="leading-tight">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
