import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button, Empty, Header } from "@/components/kit";
import { QtyStepper } from "@/components/mobile/QtyStepper";
import { cartTotals, lineTotal } from "@/lib/catalog";
import { money } from "@/lib/format";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart · Smokey Redd's BBQ" }] }),
  component: Cart,
});

function Cart() {
  const { cart, updateQty, removeFromCart } = useApp();
  const navigate = useNavigate();
  const totals = cartTotals(cart);

  return (
    <div className="pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <Header title="Your cart" fallbackTo="/menu" />
      <div className="px-4">
        {cart.length === 0 ? (
          <Empty
            title="Cart is empty"
            body="Add a plate from the menu and we’ll hold it here."
            action={
              <Link to="/menu" className="inline-flex bg-primary px-4 py-3 text-sm font-semibold text-white">
                Browse menu
              </Link>
            }
          />
        ) : (
          <>
            {cart.map((line) => (
              <div key={line.id} className="flex gap-3 border-b border-border py-4">
                <img src={line.image} alt="" className="size-16 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{line.name}</p>
                  {line.customizations.length > 0 && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {line.customizations.map((c) => c.option).join(" · ")}
                    </p>
                  )}
                  {line.notes && <p className="text-xs text-warning">Note: {line.notes}</p>}
                  <div className="mt-2 flex items-center justify-between">
                    <QtyStepper value={line.qty} min={0} onChange={(n) => updateQty(line.id, n)} />
                    <button type="button" className="text-xs text-danger" onClick={() => removeFromCart(line.id)}>
                      Remove
                    </button>
                  </div>
                </div>
                <p className="text-sm font-semibold">{money(lineTotal(line))}</p>
              </div>
            ))}

            <div className="mt-4 space-y-1 text-sm">
              <Row k="Subtotal" v={money(totals.subtotal)} />
              <Row k="Tax estimated" v={money(totals.tax)} />
              <Row k="Total" v={money(totals.total)} bold />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Delivery fee and promo codes apply at checkout.</p>
            <Button full className="mt-5 rounded-none" onClick={() => navigate({ to: "/checkout" })}>
              Review & checkout
            </Button>
          </>
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
