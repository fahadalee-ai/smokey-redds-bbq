import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useApp } from "@/lib/store";

export function CartButton() {
  const { cartCount } = useApp();
  return (
    <Link to="/cart" className="relative flex h-11 w-11 items-center justify-center border border-border bg-card">
      <ShoppingBag className="size-5" />
      {cartCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center bg-primary px-1 text-[10px] font-bold text-white">
          {cartCount}
        </span>
      )}
    </Link>
  );
}
