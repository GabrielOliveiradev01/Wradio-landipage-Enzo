import Image from "next/image";
import Link from "next/link";
import { Instagram, Mail } from "lucide-react";
import { ptBr } from "@/lib/i18n";

export default function Footer() {
  const footer = ptBr.footer;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black py-12 border-t border-zinc-900 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
          <div className="flex flex-col items-center md:items-start space-y-4 text-center md:text-left">
            <Image
              src="/wradio-logo-v2.png"
              alt="WRadio Logo"
              width={160}
              height={40}
              className="object-contain"
            />
            <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
              {footer.description}
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/wradio.ai/"
              className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-orange-500 hover:border-orange-500 transition-all duration-300"
              aria-label={footer.ariaInstagram}
            >
              <Instagram className="w-5 h-5" />
            </a>

            <a
              href="#"
              className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-orange-500 hover:border-orange-500 transition-all duration-300"
              aria-label={footer.ariaEmail}
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
          <p>&copy; {currentYear} WRadio. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">
              {footer.terms}
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              {footer.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
