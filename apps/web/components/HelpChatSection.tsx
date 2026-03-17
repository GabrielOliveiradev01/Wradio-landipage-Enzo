import { chatFeatures } from "@/data/content";
import { ptBr } from "@/lib/i18n";

export default function HelpChatSection() {
  const { titleLine1, titleHighlight, description } = ptBr.helpChat;
  return (
    <section className="w-full bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {titleLine1}
            <br />
            <span className="text-orange-500 text-2xl sm:text-3xl">
              {titleHighlight}
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 font-medium mb-8 leading-relaxed">
            {description}
          </p>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 25s linear infinite;
          }
          .pause-marquee:hover .animate-marquee {
            animation-play-state: paused;
          }
        `}</style>

        <div className="relative flex overflow-hidden w-full pause-marquee group py-4">
          <div className="absolute top-0 left-0 w-8 sm:w-16 h-full bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-8 sm:w-16 h-full bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

          <div className="flex shrink-0 animate-marquee gap-6 pr-6">
            {chatFeatures.map((feature, index) => (
              <div
                key={index}
                className="w-[280px] sm:w-[320px] shrink-0 bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
              >
                <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
                  <feature.icon className="h-5 w-5 text-orange-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div
            className="flex shrink-0 animate-marquee gap-6 pr-6"
            aria-hidden="true"
          >
            {chatFeatures.map((feature, index) => (
              <div
                key={`dup-${index}`}
                className="w-[280px] sm:w-[320px] shrink-0 bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
              >
                <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
                  <feature.icon className="h-5 w-5 text-orange-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
