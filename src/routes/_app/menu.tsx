import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button, Header } from "@/components/kit";
import { CartButton } from "@/components/mobile/CartButton";
import { MenuCard } from "@/components/mobile/MenuCard";
import { categories, menu } from "@/lib/catalog";

type Search = { cat?: string };

export const Route = createFileRoute("/_app/menu")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    cat: typeof s.cat === "string" ? s.cat : undefined,
  }),
  head: () => ({ meta: [{ title: "Menu · Smokey Redd's BBQ" }] }),
  component: MenuPage,
});

function MenuPage() {
  const { cat } = Route.useSearch();
  const [active, setActive] = useState(cat ?? "all");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return menu.filter((m) => {
      if (active !== "all" && m.categoryId !== active) return false;
      if (query && !m.name.toLowerCase().includes(query) && !m.description.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [active, q]);

  return (
    <div>
      <Header title="Menu" subtitle="Food, sides, and drinks" back={false} right={<CartButton />} />
      <div className="px-4 pb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the pit…"
          className="mb-3 w-full border border-border bg-card px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        <div className="mb-2 flex gap-2 overflow-x-auto no-scrollbar">
          <Chip label="All" active={active === "all"} onClick={() => setActive("all")} />
          {categories.map((c) => (
            <Chip key={c.id} label={c.name} active={active === c.id} onClick={() => setActive(c.id)} />
          ))}
        </div>
        {rows.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
        {rows.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">Nothing matches that search.</p>
            <Button
              className="mt-4 rounded-none"
              onClick={() => {
                setQ("");
                setActive("all");
              }}
            >
              Show full menu
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 px-3 py-2 text-xs font-semibold ${active ? "bg-primary text-white" : "border border-border text-muted-foreground"}`}
    >
      {label}
    </button>
  );
}
