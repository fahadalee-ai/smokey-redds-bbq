import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Empty, Header, LinkButton } from "@/components/kit";
import { StatusTrack } from "@/components/mobile/StatusTrack";
import { lineTotal, STATUS_COLOR, STATUS_LABEL } from "@/lib/catalog";
import { formatDateTime, money } from "@/lib/format";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/orders/$id")({
  head: () => ({ meta: [{ title: "Order · Smokey Redd's BBQ" }] }),
  component: OrderDetail,
});

function OrderDetail() {
  const { id } = Route.useParams();
  const { orders } = useApp();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div>
        <Header title="Order" fallbackTo="/orders" />
        <div className="px-4">
          <Empty
            title="Order not found"
            body="That ticket isn’t here. Head home and start a new plate, or check your orders."
            action={
              <LinkButton to="/" full className="rounded-none">
                Back to Home
              </LinkButton>
            }
          />
        </div>
      </div>
    );
  }

  const done = order.status === "ready" || order.status === "delivered";

  return (
    <div className="pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <Header title={order.number} subtitle={formatDateTime(order.placedAt)} fallbackTo="/orders" />
      <div className="px-4">
        <div className="mb-5 flex items-center justify-between">
          <span className="px-2 py-1 text-[11px] font-bold uppercase text-white" style={{ background: STATUS_COLOR[order.status] }}>
            {STATUS_LABEL[order.status]}
          </span>
          <span className="text-sm text-muted-foreground">{order.type === "delivery" ? "Delivery" : "Takeaway"}</span>
        </div>

        <StatusTrack status={order.status} type={order.type} />

        {order.type === "takeaway" && (
          <p className="mb-4 border border-border bg-card px-3 py-3 text-sm">
            Pickup: <span className="font-semibold">{order.pickupTime}</span>
            {order.status === "ready" && <span className="mt-1 block text-success">It’s up — come grab it.</span>}
          </p>
        )}
        {order.type === "delivery" && (
          <p className="mb-4 border border-border bg-card px-3 py-3 text-sm">
            {order.deliveryAddress}
            <span className="mt-1 block text-muted-foreground">{order.deliveryTime}</span>
          </p>
        )}

        <h2 className="mb-2 text-sm font-semibold">Receipt</h2>
        {order.items.map((it) => (
          <div key={it.id} className="flex justify-between gap-3 border-b border-border py-2 text-sm">
            <div>
              <p>
                {it.qty}× {it.name}
              </p>
              {it.customizations.length > 0 && (
                <p className="text-xs text-muted-foreground">{it.customizations.map((c) => c.option).join(" · ")}</p>
              )}
            </div>
            <span>{money(lineTotal(it))}</span>
          </div>
        ))}
        <div className="mt-3 space-y-1 text-sm">
          <Row k="Subtotal" v={money(order.subtotal)} />
          {order.discount > 0 && <Row k={`Promo ${order.promoCode ?? ""}`} v={`−${money(order.discount)}`} />}
          {order.deliveryFee > 0 && <Row k="Delivery" v={money(order.deliveryFee)} />}
          <Row k="Tax" v={money(order.tax)} />
          <Row k="Paid" v={money(order.total)} bold />
          <p className="pt-1 text-xs capitalize text-muted-foreground">
            {order.paymentMethod.replaceAll("_", " ")} · +{order.pointsEarned} loyalty points
          </p>
        </div>

        <LinkButton to="/" full className="mt-6 rounded-none">
          Back to Home
        </LinkButton>

        {done && (
          <Link to="/reviews" className="mt-3 block">
            <Button full variant="outline" className="rounded-none">
              Rate this order
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-semibold" : "text-muted-foreground"}`}>
      <span>{k}</span>
      <span className={bold ? "text-foreground" : ""}>{v}</span>
    </div>
  );
}
