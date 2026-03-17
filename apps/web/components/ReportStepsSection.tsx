import { ptBr } from "@/lib/i18n";

const { reportSteps } = ptBr;
const steps = reportSteps.steps;

export default function ReportStepsSection() {
  return (
    <section className="w-full bg-white pt-0 pb-20 sm:pt-0 sm:pb-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-4xl md:text-5xl mb-4 leading-tight">
            {reportSteps.titleLine1}
            <br />
            {reportSteps.titleLine2}
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-4 font-medium">
            {reportSteps.subtitleLine1}
            <br />
            {reportSteps.subtitleLine2}
          </p>
        </div>

        <div className="mx-auto w-full max-w-6xl">
          <div className="relative">
            <div className="absolute top-5 sm:top-6 left-[12.5%] right-[12.5%] h-1 sm:h-2 rounded-full bg-gradient-to-r from-orange-300 to-orange-500" />

            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {steps.map((step, index) => (
                <div
                  key={step.title + index}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative z-10 h-10 w-10 sm:h-14 sm:w-14 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-base sm:text-xl shadow-md ring-4 ring-white">
                    {index + 1}
                  </div>
                  <div className="mt-4 sm:mt-8 text-[11px] sm:text-xl leading-snug font-medium text-gray-600 px-1">
                    {step.emphasize ? (
                      <div className="flex flex-col gap-0.5">
                        <p className="text-orange-500 font-bold whitespace-nowrap">
                          {step.title}
                        </p>
                        <p className="text-[9px] sm:text-sm text-gray-400 font-normal">
                          {step.middle}
                        </p>
                        <p className="text-orange-500 font-bold whitespace-nowrap">
                          {step.subtitle}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-0.5">
                        <p className="text-gray-900 sm:text-gray-600">
                          {step.title}
                        </p>
                        {step.subtitle && (
                          <p className="text-orange-500 font-bold sm:font-medium">
                            {step.subtitle}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
