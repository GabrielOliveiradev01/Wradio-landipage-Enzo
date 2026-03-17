import Link from "next/link";
import Image from "next/image";
import { ptBr } from "@/lib/i18n";

export default function HeroSection() {
  const hero = ptBr.hero;

  return (
    <section className="pt-0 pb-0 lg:pt-28 lg:pb-0 min-h-[95vh] flex items-center lg:items-start">
      <div className="absolute inset-0 z-0 hidden md:block">
        <Image
          src="/1.png"
          alt="Wradio Background Desktop"
          fill
          priority
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 z-0 block md:hidden">
        <Image
          src="/IMG_3582.JPG"
          alt="Wradio Background Mobile"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-2 w-full">
        <div className="max-w-2xl text-center lg:text-left lg:max-w-[540px] lg:px-0 lg:pt-8">
          <Image
            src="/icone-branco-8.png"
            alt="Wradio Icon"
            width={60}
            height={60}
            className="mb-2 mx-auto lg:hidden"
          />
          <h1 className="text-5xl tracking-tight font-bold text-white lg:text-black sm:text-5xl md:text-6xl mb-6 leading-tight leading-[3.0]">
            {hero.titleLine1}
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-white lg:text-[#f97316] max-w-lg mx-auto lg:mx-0 mb-12 font-bold lg:font-normal leading-[1.3]">
            {hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full mb-10">
            <Link
              href="https://app.sswradio.com/inicio?signup=cadastro"
              className="w-full sm:w-auto px-8 py-4 rounded-3xl bg-black lg:bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all shadow-md active:scale-95 text-center"
            >
              {hero.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
