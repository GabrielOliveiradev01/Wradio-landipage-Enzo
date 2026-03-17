"use client";

import Image from "next/image";
import { useState } from "react";
import { IoFlash } from "react-icons/io5";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { slides, sliderMinSwipeDistance } from "@/data/content";
import { ptBr } from "@/lib/i18n";

export default function ReportExpressSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const minSwipeDistance = sliderMinSwipeDistance;

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % slides.length);

  const prevSlide = () =>
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;

    const distance = touchStartX - touchEndX;

    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  const { title, subtitle, description, highlight } = ptBr.reportExpress;

  return (
    <section className="w-full bg-black py-14 sm:py-20 overflow-hidden">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <IoFlash className="h-8 w-8 text-orange-500 sm:h-12 sm:w-12 lg:h-16 lg:w-16" />
          </div>
          <h2 className="text-4xl tracking-tight font-bold text-white sm:text-5xl md:text-5xl mb-2">
            {title}
          </h2>
          <p className="text-xl text-orange-500 font-semibold mb-6">
            {subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto w-full">
          <div className="flex justify-center gap-4 mb-8">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`px-6 py-2 rounded-full text-lg font-medium transition-all duration-300 ${
                  activeSlide === index
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-neutral-700 text-neutral-100 hover:bg-neutral-600"
                }`}
              >
                {slide.title}
              </button>
            ))}
          </div>

          <div className="relative group">
            <div className="overflow-hidden rounded-[1.5rem] border-[3px] border-orange-500 shadow-xl bg-white">
              <div
                className="flex transition-transform duration-500 ease-in-out touch-pan-y"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {slides.map((slide, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    width={2940}
                    height={1912}
                    className="h-auto w-full"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    sizes="(max-width: 768px) 90vw, (max-width: 1280px) 70vw, 900px"
                  />
                </div>
                ))}
              </div>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 p-2 rounded-full shadow-md text-orange-500 transition-all opacity-0 group-hover:opacity-100 hidden sm:block backdrop-blur-sm"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 p-2 rounded-full shadow-md text-orange-500 transition-all opacity-0 group-hover:opacity-100 hidden sm:block backdrop-blur-sm"
            >
              <ChevronRight size={24} />
            </button>

            <div className="flex justify-center gap-2 mt-6">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeSlide === index
                      ? "bg-orange-500 w-6"
                      : "bg-neutral-800 w-2.5"
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="mt-4 text-xl text-white max-w-2xl mx-auto mb-8 font-medium text-center">
            {description}{" "}
            <span className="text-orange-500">{highlight}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
