"use client";

import Link from "next/link";
import { cn } from "../lib/utils";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ptBr } from "@/lib/i18n";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const { navItems, ctaPrimary, ctaSecondary, ariaToggleMenu } = ptBr.navbar;

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/wradio-logo-v2.png"
                alt="Wradio"
                width={150}
                height={35}
                className="h-10 w-auto object-contain"
                priority
                unoptimized
              />
            </Link>
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-orange-500 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="https://app.sswradio.com/inicio?signup=cadastro"
              className={cn(
                "px-6 py-2 rounded-3xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors shadow-sm",
              )}
            >
              {ctaPrimary}
            </Link>
            <Link
              href="https://app.sswradio.com/inicio?signup=login"
              className={cn(
                "px-6 py-2 rounded-3xl border border-orange-500 text-orange-500 font-medium hover:bg-orange-50 transition-colors",
              )}
            >
              {ctaSecondary}
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-orange-500 focus:outline-none transition-colors"
              aria-label={ariaToggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden absolute top-20 left-0 w-full bg-white transition-all duration-300 ease-in-out z-40 overflow-hidden flex flex-col",
          isMenuOpen
            ? "h-[calc(100dvh-80px)] opacity-100"
            : "h-0 opacity-0 pointer-events-none",
        )}
      >
        <div className="flex-1 flex flex-col px-4 pt-4 pb-8 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-lg font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-[1.5rem] transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="mt-auto pt-8 flex flex-col gap-4">
            <Link
              href="https://app.sswradio.com/inicio?signup=cadastro"
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-center px-6 py-4 rounded-[1.5rem] bg-orange-500 text-white text-lg font-medium hover:bg-orange-600 transition-colors shadow-sm"
            >
              {ctaPrimary}
            </Link>
            <Link
              href="https://app.sswradio.com/inicio?signup=login"
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-center px-6 py-4 rounded-[1.5rem] border-2 border-orange-500 text-orange-500 text-lg font-medium hover:bg-orange-50 transition-colors"
            >
              {ctaSecondary}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
