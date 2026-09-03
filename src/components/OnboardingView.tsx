import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/kit";
import { ONBOARDING } from "@/lib/catalog";
import { useApp } from "@/lib/store";

export function OnboardingView() {
  const { markOnboarded, user } = useApp();
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const slide = ONBOARDING[i];
  const last = i === ONBOARDING.length - 1;

  function finish() {
    markOnboarded();
    void navigate({ to: user ? "/" : "/login", replace: true });
  }

  function next() {
    if (!last) {
      setI((n) => n + 1);
      return;
    }
    finish();
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-black">
      <img key={slide.image} src={slide.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/20" />

      <div className="relative z-10 flex min-h-dvh flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex items-start justify-between">
          <div className="bg-black/40 px-1">
            <BrandLogo className="h-14 w-auto" />
          </div>
          <button
            type="button"
            className="pt-2 text-xs font-semibold uppercase tracking-wider text-white/80"
            onClick={finish}
          >
            Skip
          </button>
        </div>

        <div className="flex-1" />

        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F99B1C]">
          {String(i + 1).padStart(2, "0")} / {String(ONBOARDING.length).padStart(2, "0")}
        </p>
        <h1 className="mt-2 max-w-[20rem] text-[1.85rem] font-semibold leading-tight tracking-tight text-white">
          {slide.title}
        </h1>
        <p className="mt-3 max-w-[21rem] text-[15px] leading-relaxed text-white/85">{slide.body}</p>

        <div className="mb-5 mt-6 flex gap-1.5">
          {ONBOARDING.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-1 flex-1 ${idx === i ? "bg-primary" : "bg-white/35"}`}
            />
          ))}
        </div>

        <Button full onClick={next} className="rounded-none">
          {last ? "Get started" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
