import { Minus, Plus } from "lucide-react";

export function QtyStepper({
  value,
  onChange,
  min = 1,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
}) {
  return (
    <div className="inline-flex items-center border border-border">
      <button
        type="button"
        aria-label="Decrease"
        className="flex h-9 w-9 items-center justify-center text-foreground disabled:opacity-30"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Minus className="size-4" />
      </button>
      <span className="w-8 text-center text-sm font-semibold">{value}</span>
      <button
        type="button"
        aria-label="Increase"
        className="flex h-9 w-9 items-center justify-center text-foreground"
        onClick={() => onChange(value + 1)}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
