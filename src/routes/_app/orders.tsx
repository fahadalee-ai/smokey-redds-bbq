import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/kit";
import { STATUS_COLOR, STATUS_LABEL } from "@/lib/catalog";
import { formatDateTime, money } from "@/lib/format";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app/orders")({
  head: () => ({ meta: [{ title: "Orders · Smokey Redd's BBQ" }] }),
  component: Orders,
});

function Orders() {
  const { orders, user } = useApp();
  const mine = orders.filter((o) => o.customerId === user?.id);

  return (
    <div>
      <Header title="Your orders" subtitle="Track pickup and delivery" back={false} />
      <div className="px-4 pb-6">
        {mine.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No tickets yet.{" "}
            <Link to="/menu" className="font-semibold text-primary">
              Order something smoky.
            </Link>
          </p>
        )}
        {mine.map((o) => (
          <Link key={o.id} to="/orders/$id" params={{ id: o.id }} className="mb-3 block border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{o.number}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(o.placedAt)}</p>
              </div>
              <span className="px-2 py-0.5 text-[11px] font-bold uppercase text-white" style={{ background: STATUS_COLOR[o.status] }}>
                {STATUS_LABEL[o.status]}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {o.type === "delivery" ? "Delivery" : "Takeaway"} · {o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
            </p>
            <p className="mt-2 text-sm font-semibold">{money(o.total)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
