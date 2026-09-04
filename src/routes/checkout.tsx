import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button, Empty, Field, Header, Input, LinkButton, Select } from "@/components/kit";
import { applyPromo, cartTotals, deliveryFeeFor, pickupSlots, type OrderType, type PaymentMethod } from "@/lib/catalog";
import { money } from "@/lib/format";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout · Smokey Redd's BBQ" }] }),
  component: Checkout,
});

function Checkout() {
  const { cart, user, orders, placeOrder } = useApp();
  const navigate = useNavigate();
  const [type, setType] = useState<OrderType>("takeaway");
  const [pickup, setPickup] = useState(pickupSlots()[0]);
  const [addressId, setAddressId] = useState(user?.addresses[0]?.id ?? "");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("Austin");
  const [zip, setZip] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("ASAP · 25–45 min");
  const [notes, setNotes] = useState("");
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");
  const [pay, setPay] = useState<PaymentMethod>("card");
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [exp, setExp] = useState("12/28");
  const [cvc, setCvc] = useState("123");
  const slots = useMemo(() => pickupSlots(), []);

  const fee = type === "delivery" ? deliveryFeeFor() : 0;
  const totals = cartTotals(cart, discount, fee);
  const address =
    user?.addresses.find((a) => a.id === addressId) ??
    (line1
      ? { id: "new", label: "New", line1, city, state: "TX", zip }
      : undefined);

  function tryPromo() {
    const first = orders.filter((o) => o.customerId === user?.id).length === 0;
    const result = applyPromo(code, cartTotals(cart).subtotal, first);
    if ("error" in result) {
      toast.error(result.error);
      setDiscount(0);
      setAppliedCode("");
      return;
    }
    setDiscount(result.discount);
    setAppliedCode(result.promo.code);
    toast("Code applied", { description: result.promo.description });
  }

  function payNow() {
    if (type === "delivery" && !address) {
      toast.error("Add a delivery address.");
      return;
    }
    const result = placeOrder({
      type,
      paymentMethod: pay,
      pickupTime: type === "takeaway" ? pickup : undefined,
      deliveryAddress:
        type === "delivery" && address
          ? `${address.line1}, ${address.city}, ${address.state} ${address.zip}`
          : undefined,
      deliveryTime: type === "delivery" ? deliveryTime : undefined,
      notes,
      promoCode: appliedCode || undefined,
    });
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    void navigate({ to: "/orders/$id", params: { id: result.id } });
  }

  if (!cart.length) {
    return (
      <div>
        <Header title="Checkout" fallbackTo="/cart" />
        <div className="px-4">
          <Empty
            title="Nothing to check out"
            body="Add a plate first, then you can pick pickup or delivery and pay."
            action={
              <LinkButton to="/menu" full className="rounded-none">
                Browse menu
              </LinkButton>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <Header title="Checkout" subtitle="Review, then pay" fallbackTo="/cart" />
      <div className="space-y-5 px-4">
        <div className="grid grid-cols-2 gap-2">
          {(["takeaway", "delivery"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={cn("border py-3 text-sm font-semibold", type === t ? "border-primary bg-primary text-white" : "border-border")}
            >
              {t === "takeaway" ? "Takeaway" : "Delivery"}
            </button>
          ))}
        </div>

        {type === "takeaway" ? (
          <Field label="Pickup time">
            <Select value={pickup} onChange={(e) => setPickup(e.target.value)}>
              {slots.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>
        ) : (
          <>
            {user?.addresses.length ? (
              <Field label="Saved address">
                <Select value={addressId} onChange={(e) => setAddressId(e.target.value)}>
                  {user.addresses.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label} · {a.line1}
                    </option>
                  ))}
                  <option value="">New address</option>
                </Select>
              </Field>
            ) : null}
            {(!user?.addresses.length || !addressId) && (
              <>
                <Field label="Street">
                  <Input value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="1402 E 6th St" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="City">
                    <Input value={city} onChange={(e) => setCity(e.target.value)} />
                  </Field>
                  <Field label="ZIP">
                    <Input value={zip} onChange={(e) => setZip(e.target.value)} />
                  </Field>
                </div>
              </>
            )}
            <Field label="Delivery window">
              <Select value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)}>
                <option>ASAP · 25–45 min</option>
                <option>Lunch · 12:00–12:30</option>
                <option>Afternoon · 3:00–3:30</option>
                <option>Dinner · 6:00–6:30</option>
              </Select>
            </Field>
          </>
        )}

        <Field label="Order notes">
          <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Gate code, extra napkins…" />
        </Field>

        <div className="flex gap-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Promo code"
            className="flex-1"
          />
          <Button type="button" variant="outline" className="rounded-none" onClick={tryPromo}>
            Apply
          </Button>
        </div>
        {appliedCode && <p className="text-xs text-success">{appliedCode} saved you {money(discount)}</p>}

        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Pay with</p>
          <div className="grid grid-cols-3 gap-2">
            {([
              ["card", "Card"],
              ["apple_pay", "Apple Pay"],
              ["google_pay", "Google Pay"],
            ] as const).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setPay(id)}
                className={cn("border py-2 text-xs font-semibold", pay === id ? "border-primary bg-primary text-white" : "border-border")}
              >
                {label}
              </button>
            ))}
          </div>
          {pay === "card" && (
            <div className="mt-3 space-y-3">
              <Field label="Card number">
                <Input value={card} onChange={(e) => setCard(e.target.value)} inputMode="numeric" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Exp">
                  <Input value={exp} onChange={(e) => setExp(e.target.value)} />
                </Field>
                <Field label="CVC">
                  <Input value={cvc} onChange={(e) => setCvc(e.target.value)} />
                </Field>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-1 text-sm">
          <Row k="Subtotal" v={money(totals.subtotal)} />
          {discount > 0 && <Row k="Discount" v={`−${money(discount)}`} />}
          {fee > 0 && <Row k="Delivery" v={money(fee)} />}
          <Row k="Tax" v={money(totals.tax)} />
          <Row k="Total" v={money(totals.total)} bold />
        </div>

        <Button full className="rounded-none" onClick={payNow}>
          Pay {money(totals.total)}
        </Button>
        <p className="text-center text-[11px] text-muted-foreground">Demo checkout — no real charge. You’ll get a digital receipt on the next screen.</p>
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
