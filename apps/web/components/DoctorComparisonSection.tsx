import { ptBr } from "@/lib/i18n";

const { doctorComparison } = ptBr;

export default function DoctorComparisonSection() {
  return (
    <section className="w-full bg-white py-14 sm:py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          <div className="w-full lg:w-1/2 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-500 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

            <div className="relative bg-white rounded-[2rem] overflow-hidden shadow-2xl">
              <video
                src="/video-radio.mov"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto object-cover transform transition duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          <div className="w-full lg:w-1/2 px-6 sm:px-8 lg:px-0">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 leading-tight">
              {doctorComparison.titleLine1}{" "}
              <br className="hidden sm:block" />
              <span className="text-orange-500">
                {doctorComparison.titleHighlight}
              </span>{" "}
              {doctorComparison.titleLine2}
            </h2>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-10 sm:gap-8 mb-4">
                <div className="text-sm font-bold uppercase tracking-wider text-orange-500 px-3 py-1 bg-orange-50 rounded-lg inline-block w-fit justify-self-center">
                  {doctorComparison.labelCom}
                </div>

                <div className="text-sm font-bold uppercase tracking-wider text-gray-400 px-3 py-1 bg-gray-50 rounded-lg inline-block w-fit justify-self-center">
                  {doctorComparison.labelSem}
                </div>
              </div>

              {doctorComparison.comparisons.map((item, index) => (
                <div key={index} className="space-y-6">
                  <div className="grid grid-cols-2 gap-10 sm:gap-8 text-center">
                    <div className="flex justify-center">
                      <p className="max-w-xs sm:max-w-none text-base sm:text-xl font-medium text-gray-800 leading-relaxed">
                        {item.with}
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <p className="max-w-xs sm:max-w-none text-base sm:text-xl font-medium text-gray-400 leading-relaxed italic">
                        {item.without}
                      </p>
                    </div>
                  </div>

                  {index < doctorComparison.comparisons.length - 1 && (
                    <div className="h-0.5 w-full bg-orange-500 opacity-20" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
