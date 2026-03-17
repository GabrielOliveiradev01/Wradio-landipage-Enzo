"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/data/content";
import { ptBr } from "@/lib/i18n";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const { titleMain, titleHighlight, description } = ptBr.faq;

  return (
    <section className="w-full bg-black py-14 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            {titleMain} <span className="text-orange-500">{titleHighlight}</span>
          </h2>
          <p className="text-lg text-gray-400">{description}</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-zinc-800 bg-zinc-900/50 rounded-[1.5rem] overflow-hidden transition-all duration-300 hover:border-orange-500/50"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                aria-expanded={openIndex === index}
              >
                <span className="text-lg font-medium text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-orange-500 transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "max-h-96 pb-5 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-zinc-400 leading-relaxed text-base pt-2">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
