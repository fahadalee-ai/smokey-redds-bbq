import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/kit";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications · Smokey Redd's BBQ" }] }),
  component: Notifications,
});

function Notifications() {
  const { notifications, markAllRead, markRead } = useApp();

  return (
    <div>
      <Header
        title="Notifications"
        fallbackTo="/"
        right={
          <button type="button" className="text-xs font-semibold text-primary" onClick={markAllRead}>
            Mark all read
          </button>
        }
      />
      <div className="px-4 pb-8">
        {notifications.map((n) => (
          <Link
            key={n.id}
            to={n.href as "/"}
            onClick={() => markRead(n.id)}
            className={cn("mb-2 block border border-border p-4", n.read ? "bg-card" : "bg-primary/10")}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-secondary">{n.type.replaceAll("_", " ")}</p>
            <p className="mt-1 font-semibold">{n.title}</p>
            <p className="text-sm text-muted-foreground">{n.body}</p>
            <p className="mt-1 text-xs text-muted-foreground">{n.time}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
