import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button, Empty, Header, LinkButton } from "@/components/kit";
import { QtyStepper } from "@/components/mobile/QtyStepper";
import { menu, type CustomizationChoice } from "@/lib/catalog";
import { money } from "@/lib/format";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/menu/$id")({
  head: () => ({ meta: [{ title: "Item · Smokey Redd's BBQ" }] }),
  component: ItemDetail,
});

function ItemDetail() {
  const { id } = Route.useParams();
  const item = menu.find((m) => m.id === id);
  const { addToCart } = useApp();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [picks, setPicks] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    item?.customizations.forEach((g) => {
      if (g.required && g.options[0]) init[g.id] = g.options[0].id;
    });
    return init;
  });
  const [extras, setExtras] = useState<string[]>([]);

  const customizations = useMemo<CustomizationChoice[]>(() => {
    if (!item) return [];
    const chosen: CustomizationChoice[] = [];
    item.customizations.forEach((g) => {
      if (g.id === "addons") {
        g.options
          .filter((o) => extras.includes(o.id))
          .forEach((o) => chosen.push({ group: g.name, option: o.label, price: o.price }));
        return;
      }
      const opt = g.options.find((o) => o.id === picks[g.id]);
      if (opt) chosen.push({ group: g.name, option: opt.label, price: opt.price });
    });
    return chosen;
  }, [item, picks, extras]);

  if (!item) {
    return (
      <div>
        <Header title="Item" fallbackTo="/menu" />
        <div className="px-4">
          <Empty
            title="That plate isn’t on the board"
            body="It may have sold out or moved. Browse the menu for what’s firing now."
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

  const unit = item.price + customizations.reduce((s, c) => s + c.price, 0);

  return (
    <div className="pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <Header title={item.name} fallbackTo="/menu" />
      <img src={item.image} alt="" className="h-52 w-full object-cover" />
      <div className="px-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{item.name}</h1>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          </div>
          <p className="text-lg font-semibold text-primary">{money(item.price)}</p>
        </div>

        {!item.available && (
          <p className="mt-3 border border-danger px-3 py-2 text-sm text-danger">86&apos;d for now — ask about a swap.</p>
        )}

        {item.customizations.map((group) => (
          <div key={group.id} className="mt-6">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.name}
              {group.required ? " · required" : " · optional"}
            </p>
            <div className="space-y-2">
              {group.options.map((opt) => {
                const multi = group.id === "addons";
                const on = multi ? extras.includes(opt.id) : picks[group.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      if (multi) {
                        setExtras((list) => (list.includes(opt.id) ? list.filter((x) => x !== opt.id) : [...list, opt.id]));
                      } else {
                        setPicks((p) => ({ ...p, [group.id]: opt.id }));
                      }
                    }}
                    className={cn(
                      "flex w-full items-center justify-between border px-3 py-3 text-left text-sm",
                      on ? "border-primary bg-primary/10" : "border-border bg-card",
                    )}
                  >
                    <span>{opt.label}</span>
                    <span className="text-muted-foreground">{opt.price ? `+${money(opt.price)}` : "Included"}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <label className="mt-6 block">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Special instructions
          </span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="No pickles, extra sauce on the side…"
            className="min-h-20 w-full border border-border bg-card px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>

        <div className="mt-6 flex items-center justify-between">
          <QtyStepper value={qty} onChange={setQty} />
          <p className="text-lg font-semibold">{money(unit * qty)}</p>
        </div>

        {item.available ? (
          <Button
            full
            className="mt-4 rounded-none"
            onClick={() => {
              addToCart({
                menuItemId: item.id,
                name: item.name,
                image: item.image,
                qty,
                unitPrice: item.price,
                customizations,
                notes,
              });
              void navigate({ to: "/cart" });
            }}
          >
            Add to cart · {money(unit * qty)}
          </Button>
        ) : (
          <LinkButton to="/menu" full className="mt-4 rounded-none">
            Browse other plates
          </LinkButton>
        )}
      </div>
    </div>
  );
}
