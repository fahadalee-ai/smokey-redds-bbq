import { STATUS_COLOR, STATUS_LABEL, type OrderStatus, type OrderType } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const TAKEAWAY: OrderStatus[] = ["received", "preparing", "ready"];
const DELIVERY: OrderStatus[] = ["received", "preparing", "out_for_delivery", "delivered"];

export function StatusTrack({ status, type }: { status: OrderStatus; type: OrderType }) {
  const steps = type === "delivery" ? DELIVERY : TAKEAWAY;
  const idx = steps.indexOf(status);

  return (
    <ol className="space-y-3">
      {steps.map((step, i) => {
        const done = idx >= i && status !== "cancelled";
        return (
          <li key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn("mt-0.5 size-3 shrink-0", done ? "" : "border border-border bg-transparent")}
                style={{ background: done ? STATUS_COLOR[step] : undefined }}
              />
              {i < steps.length - 1 && <span className={cn("w-px flex-1", done ? "bg-primary" : "bg-border")} />}
            </div>
            <p className={cn("pb-4 text-sm", done ? "font-semibold text-foreground" : "text-muted-foreground")}>
              {STATUS_LABEL[step]}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
