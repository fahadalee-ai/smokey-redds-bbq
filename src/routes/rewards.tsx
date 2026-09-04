import { createFileRoute } from "@tanstack/react-router";
import { Header, LinkButton } from "@/components/kit";
import { loyaltyTiers, promos } from "@/lib/catalog";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/rewards")({
  head: () => ({ meta: [{ title: "Rewards · Smokey Redd's BBQ" }] }),
  component: Rewards,
});

function Rewards() {
  const { user } = useApp();
  const points = user?.loyaltyPoints ?? 0;
  const birthdaySoon = user?.birthday?.slice(5, 10) === "09-08" || user?.birthday?.slice(5) === "09-08";

  return (
    <div>
      <Header title="Rewards & offers" fallbackTo="/profile" />
      <div className="px-4 pb-8">
        <div className="border border-border bg-card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Your points</p>
          <p className="mt-1 text-4xl font-semibold">{points}</p>
          <p className="mt-1 text-sm text-muted-foreground">1 point per dollar spent. App-exclusive deals below.</p>
        </div>

        <h2 className="mb-2 mt-6 text-sm font-semibold">Tiers</h2>
        <div className="space-y-2">
          {loyaltyTiers.map((t) => {
            const unlocked = points >= t.points;
            return (
              <div key={t.name} className="flex items-center justify-between border border-border bg-card px-3 py-3">
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.points} pts · {t.reward}
                  </p>
                </div>
                <span className={`text-[11px] font-bold uppercase ${unlocked ? "text-success" : "text-muted-foreground"}`}>
                  {unlocked ? "Unlocked" : `${t.points - points} to go`}
                </span>
              </div>
            );
          })}
        </div>

        {birthdaySoon && (
          <div className="mt-6 border border-secondary bg-secondary/10 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-secondary">Birthday offer</p>
            <p className="mt-1 font-semibold">20% off this week</p>
            <p className="text-sm text-muted-foreground">Auto-applied at checkout during your birthday window.</p>
          </div>
        )}

        <h2 className="mb-2 mt-6 text-sm font-semibold">Promo codes</h2>
        {promos
          .filter((p) => p.active)
          .map((p) => (
            <div key={p.id} className="mb-2 border border-border bg-card p-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold tracking-wide">{p.code}</p>
                {p.appExclusive && (
                  <span className="bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">App exclusive</span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
              {p.firstOrderOnly && <p className="text-xs text-secondary">First order only</p>}
            </div>
          ))}

        <LinkButton to="/menu" full className="mt-6 rounded-none">
          Order now
        </LinkButton>
      </div>
    </div>
  );
}
