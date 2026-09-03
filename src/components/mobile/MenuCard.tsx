import { Link } from "@tanstack/react-router";
import type { MenuItem } from "@/lib/catalog";
import { money } from "@/lib/format";

export function MenuCard({ item }: { item: MenuItem }) {
  return (
    <Link to="/menu/$id" params={{ id: item.id }} className="flex gap-3 border-b border-border py-3 last:border-0">
      <img src={item.image} alt="" className="size-[72px] shrink-0 object-cover" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold leading-snug">{item.name}</p>
          <p className="shrink-0 text-sm font-semibold text-primary">{money(item.price)}</p>
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
        <div className="mt-1.5 flex gap-1">
          {item.dailySpecial && (
            <span className="bg-secondary px-1.5 py-0.5 text-[10px] font-bold uppercase text-ink">Special</span>
          )}
          {item.featured && !item.dailySpecial && (
            <span className="bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">Featured</span>
          )}
          {!item.available && (
            <span className="bg-danger px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">86'd</span>
          )}
        </div>
      </div>
    </Link>
  );
}
