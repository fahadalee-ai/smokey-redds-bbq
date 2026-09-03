import { Link, useRouterState } from "@tanstack/react-router";
import { House, MapPin, Receipt, UserRound, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/", label: "Home", icon: House },
  { to: "/menu", label: "Menu", icon: UtensilsCrossed },
  { to: "/orders", label: "Orders", icon: Receipt },
  { to: "/location", label: "Truck", icon: MapPin },
  { to: "/profile", label: "You", icon: UserRound },
] as const;

export function TabBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="sticky bottom-0 z-30 grid grid-cols-5 border-t border-border bg-card pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5">
      {TABS.map((tab) => {
        const active = tab.to === "/" ? pathname === "/" : pathname.startsWith(tab.to);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={cn(
              "flex flex-col items-center gap-1 py-1 text-[10px] font-semibold uppercase tracking-wide",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="size-5" strokeWidth={active ? 2.4 : 1.8} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
