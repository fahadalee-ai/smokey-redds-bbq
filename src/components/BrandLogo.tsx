import logo from "@/img/logo.png";
import { cn } from "@/lib/utils";

/** Color logo on a black plate — screen-blend so the plate disappears on dark UI. */
export function BrandLogo({
  className,
  alt = "Smokey Redd's BBQ",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src={logo}
      alt={alt}
      className={cn("object-contain", className)}
      style={{ mixBlendMode: "screen" }}
    />
  );
}
