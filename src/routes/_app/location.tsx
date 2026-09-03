import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "lucide-react";
import { Header } from "@/components/kit";
import { formatDate } from "@/lib/format";
import { HOURS, schedule, truck } from "@/lib/catalog";

export const Route = createFileRoute("/_app/location")({
  head: () => ({ meta: [{ title: "Truck location · Smokey Redd's BBQ" }] }),
  component: LocationPage,
});

function LocationPage() {
  const maps = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(truck.address)}`;
  const embed = `https://www.google.com/maps?q=${truck.lat},${truck.lng}&z=15&output=embed`;
  const today = HOURS[new Date().getDay()];

  return (
    <div>
      <Header title="Find the truck" subtitle="Live pin + this week’s stops" back={false} />
      <div className="px-4 pb-6">
        <iframe title="Smokey Redd's location" src={embed} className="h-52 w-full border border-border" loading="lazy" />
        <div className="mt-3 border border-border bg-card p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Right now</p>
          <p className="mt-1 text-lg font-semibold">{truck.name}</p>
          <p className="text-sm text-muted-foreground">{truck.address}</p>
          <p className="mt-2 text-sm">
            {today.open ? (
              <>
                Open today {today.start}–{today.end}
              </>
            ) : (
              "Closed today"
            )}
          </p>
          <a
            href={maps}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 bg-primary px-4 text-sm font-semibold text-white"
          >
            <Navigation className="size-4" />
            Get directions
          </a>
        </div>

        <h2 className="mb-2 mt-6 text-lg font-semibold">Hours</h2>
        <div className="border border-border bg-card">
          {HOURS.map((d) => (
            <div key={d.day} className="flex justify-between border-b border-border px-3 py-2 text-sm last:border-0">
              <span className={d.day === today.day ? "font-semibold text-primary" : ""}>{d.label}</span>
              <span className="text-muted-foreground">{d.open ? `${d.start}–${d.end}` : "Closed"}</span>
            </div>
          ))}
        </div>

        <h2 className="mb-2 mt-6 text-lg font-semibold">Upcoming locations</h2>
        <div className="space-y-3">
          {schedule.map((s) => (
            <div key={s.id} className="border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">{formatDate(s.date)}</p>
              <p className="font-semibold">{s.name}</p>
              <p className="text-sm text-muted-foreground">{s.address}</p>
              <p className="mt-1 text-sm">
                {s.start}–{s.end}
              </p>
              {s.notes && <p className="mt-1 text-xs text-secondary">{s.notes}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
