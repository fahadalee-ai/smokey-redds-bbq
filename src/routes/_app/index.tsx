import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronRight, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { CartButton } from "@/components/mobile/CartButton";
import { MenuCard } from "@/components/mobile/MenuCard";
import { OnboardingView } from "@/components/OnboardingView";
import { SplashView } from "@/components/SplashView";
import { categories, menu, truck } from "@/lib/catalog";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/")({
  head: () => ({ meta: [{ title: "Smokey Redd's BBQ" }] }),
  component: HomeGate,
});

function HomeGate() {
  const { hydrated, onboarded, user } = useApp();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"splash" | "ready">("splash");

  useEffect(() => {
    if (!hydrated) return;
    const seen = sessionStorage.getItem("sr-splash") === "1";
    // First open and anyone who hasn't finished slides: splash, then onboarding.
    if (!onboarded || !seen) {
      const t = window.setTimeout(() => {
        sessionStorage.setItem("sr-splash", "1");
        setPhase("ready");
      }, 2600);
      return () => window.clearTimeout(t);
    }
    setPhase("ready");
  }, [hydrated, onboarded]);

  useEffect(() => {
    if (!hydrated || phase === "splash" || !onboarded || user) return;
    void navigate({ to: "/login", replace: true });
  }, [hydrated, phase, onboarded, user, navigate]);

  if (!hydrated || phase === "splash") {
    return (
      <div className="fixed inset-0 z-50">
        <SplashView />
      </div>
    );
  }

  if (!onboarded) {
    return (
      <div className="fixed inset-0 z-50">
        <OnboardingView />
      </div>
    );
  }

  if (!user) return null;

  return <Home />;
}

function Home() {
  const { user, unreadCount } = useApp();
  const featured = menu.filter((m) => m.featured && m.available);
  const specials = menu.filter((m) => m.dailySpecial && m.available);

  return (
    <div className="pb-4">
      <header className="flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Smokey Redd&apos;s</p>
          <h1 className="text-xl font-semibold tracking-tight">Hey, {user?.firstName}</h1>
        </div>
        <div className="flex gap-2">
          <Link to="/notifications" className="relative flex h-11 w-11 items-center justify-center border border-border bg-card">
            <Bell className="size-5" />
            {unreadCount > 0 && <span className="absolute right-1.5 top-1.5 size-2 bg-primary" />}
          </Link>
          <CartButton />
        </div>
      </header>

      <Link to="/location" className="mx-4 flex items-center gap-3 border border-border bg-card px-3 py-3">
        <MapPin className="size-5 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Truck is at</p>
          <p className="truncate text-sm font-medium">
            {truck.name} · {truck.address}
          </p>
        </div>
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between px-4">
          <h2 className="text-lg font-semibold">Daily specials</h2>
          <Link to="/menu" className="text-xs font-semibold text-primary">
            Full menu
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 no-scrollbar">
          {specials.map((item) => (
            <Link key={item.id} to="/menu/$id" params={{ id: item.id }} className="w-40 shrink-0">
              <img src={item.image} alt="" className="h-28 w-full object-cover" />
              <p className="mt-2 text-sm font-semibold leading-snug">{item.name}</p>
              <p className="text-xs text-secondary">Today only</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 px-4 text-lg font-semibold">Browse</h2>
        <div className="grid grid-cols-3 gap-2 px-4">
          {categories.map((c) => (
            <Link key={c.id} to="/menu" search={{ cat: c.id }} className="relative h-24 overflow-hidden">
              <img src={c.image} alt="" className="h-full w-full object-cover" />
              <span className="absolute inset-0 bg-black/45" />
              <span className="absolute inset-x-1 bottom-2 text-center text-[11px] font-semibold leading-tight">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 px-4">
        <h2 className="mb-1 text-lg font-semibold">Featured plates</h2>
        {featured.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </section>

      <Link to="/rewards" className="mx-4 mt-6 block border border-border bg-card px-4 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Loyalty</p>
        <p className="mt-1 text-lg font-semibold">{user?.loyaltyPoints} points</p>
        <p className="text-xs text-muted-foreground">Earn 1 point per dollar. App-exclusive codes on Rewards.</p>
      </Link>
    </div>
  );
}
