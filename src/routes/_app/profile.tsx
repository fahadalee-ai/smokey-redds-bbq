import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronRight, Gift, LogOut, MapPin, MessageSquareHeart, UserRound } from "lucide-react";
import { Header } from "@/components/kit";
import { initials } from "@/lib/format";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "You · Smokey Redd's BBQ" }] }),
  component: Profile,
});

function Profile() {
  const { user, logout, unreadCount } = useApp();
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <div>
      <Header title="You" back={false} />
      <div className="px-4 pb-6">
        <div className="mb-5 flex items-center gap-3 border border-border bg-card p-4">
          <div className="flex size-14 items-center justify-center bg-primary text-sm font-bold">
            {initials(`${user.firstName} ${user.lastName}`)}
          </div>
          <div>
            <p className="text-lg font-semibold">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-secondary">{user.loyaltyPoints} loyalty points</p>
          </div>
        </div>

        <Row to="/rewards" icon={<Gift className="size-4" />} label="Rewards & offers" value={`${user.loyaltyPoints} pts`} />
        <Row to="/notifications" icon={<Bell className="size-4" />} label="Notifications" value={unreadCount ? `${unreadCount} new` : undefined} />
        <Row to="/reviews" icon={<MessageSquareHeart className="size-4" />} label="Reviews" />
        <Row to="/location" icon={<MapPin className="size-4" />} label="Truck location" />
        <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-4">
          <span className="text-primary">
            <UserRound className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Saved addresses</p>
            <p className="text-xs text-muted-foreground">
              {user.addresses.length ? user.addresses.map((a) => a.label).join(" · ") : "Add one at checkout"}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="mt-6 flex w-full items-center justify-center gap-2 border border-border py-3 text-sm font-semibold text-muted-foreground"
          onClick={() => {
            logout();
            void navigate({ to: "/login" });
          }}
        >
          <LogOut className="size-4" />
          Log out
        </button>
      </div>
    </div>
  );
}

function Row({ to, icon, label, value }: { to: "/rewards" | "/notifications" | "/reviews" | "/location"; icon: React.ReactNode; label: string; value?: string }) {
  return (
    <Link to={to} className="flex items-center gap-3 border-b border-border bg-card px-4 py-4">
      <span className="text-primary">{icon}</span>
      <span className="flex-1 text-sm font-medium">{label}</span>
      {value && <span className="text-xs text-muted-foreground">{value}</span>}
      <ChevronRight className="size-4 text-muted-foreground" />
    </Link>
  );
}
