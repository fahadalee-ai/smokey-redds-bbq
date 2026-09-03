import { BrandLogo } from "@/components/BrandLogo";

export function SplashView() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#0c0c0c] px-8">
      <img
        src="https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1400&q=80"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/45" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(12,12,12,0.55)_20%,transparent_70%)]" />

      <p className="relative z-10 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#F99B1C]">
        Texas oak · Honest smoke
      </p>
      <div className="relative z-10 mt-3 bg-black/50 px-3 py-2">
        <BrandLogo className="h-[10.5rem] w-auto max-w-[19rem]" />
      </div>
      <p className="relative z-10 mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
        Dare to be great
      </p>

      <div className="absolute bottom-[max(2.5rem,env(safe-area-inset-bottom))] left-8 right-8 z-10">
        <div className="h-0.5 overflow-hidden bg-white/20">
          <div className="h-full bg-primary" style={{ animation: "splash-bar 2.2s ease-in-out infinite" }} />
        </div>
      </div>
    </div>
  );
}
