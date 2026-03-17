import Link from "next/link";
import Image from "next/image";

const STATS = [
  "+2.000 radiologistas ativos",
  "Laudos até 60% mais rápidos",
  "Disponível em qualquer lugar",
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ── */}
      <aside
        className="hidden lg:flex w-[420px] shrink-0 flex-col p-10 relative overflow-hidden"
        style={{ backgroundColor: "#09090b" }}
      >
        {/* Logo */}
        <Link href="/" className="relative z-10">
          <Image
            src="/wradio-logo-v2.png"
            alt="Wradio"
            width={120}
            height={30}
            className="h-8 w-auto object-contain brightness-0 invert opacity-90"
            priority
            unoptimized
          />
        </Link>

        {/* Radar rings — decorative */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] pointer-events-none">
          <div className="w-[380px] h-[380px] rounded-full border border-white/[0.04]" />
          <div className="absolute inset-[48px] rounded-full border border-white/[0.06]" />
          <div className="absolute inset-[96px] rounded-full border border-white/[0.08]" />
          <div className="absolute inset-[144px] rounded-full border border-orange-500/20" />
          <div
            className="absolute inset-[172px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(249,115,22,0.25) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Brand statement */}
        <div className="relative z-10 mt-auto mb-auto pt-32">
          <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-4">
            Wradio · IA para Radiologia
          </p>
          <h2 className="text-3xl font-bold text-white leading-tight">
            Laudos mais rápidos.
            <br />
            <span className="text-orange-400">Muito mais rápidos.</span>
          </h2>
          <p className="text-zinc-400 mt-4 text-sm leading-relaxed max-w-[260px]">
            Plataforma de inteligência artificial criada para radiologistas que
            valorizam seu tempo.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 space-y-3 mt-auto">
          {STATS.map((stat) => (
            <div key={stat} className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
              <span className="text-zinc-400 text-xs">{stat}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Mobile header */}
        <header className="lg:hidden w-full py-5 px-6 border-b border-gray-100">
          <Link href="/">
            <Image
              src="/wradio-logo-v2.png"
              alt="Wradio"
              width={110}
              height={28}
              className="h-7 w-auto object-contain"
              priority
              unoptimized
            />
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-8 py-12">
          {children}
        </main>
      </div>
    </div>
  );
}
