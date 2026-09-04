import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Header, LinkButton, Textarea } from "@/components/kit";
import { formatDate } from "@/lib/format";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reviews")({
  head: () => ({ meta: [{ title: "Reviews · Smokey Redd's BBQ" }] }),
  component: Reviews,
});

function Reviews() {
  const { reviews, addReview } = useApp();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  return (
    <div>
      <Header title="Reviews" subtitle="Food, service, the whole pit" fallbackTo="/profile" />
      <div className="px-4 pb-8">
        <div className="mb-6 border border-border bg-card p-4">
          <p className="text-sm font-semibold">Leave a review</p>
          <div className="my-3 flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={cn("h-9 w-9 text-sm font-bold", n <= rating ? "bg-primary text-white" : "border border-border text-muted-foreground")}
              >
                {n}
              </button>
            ))}
          </div>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="How was the smoke?" />
          <Button
            full
            className="mt-3 rounded-none"
            disabled={!text.trim()}
            onClick={() => {
              addReview(rating, text.trim());
              setText("");
              setRating(5);
            }}
          >
            Submit review
          </Button>
        </div>

        {reviews.map((r) => (
          <div key={r.id} className="mb-3 border-b border-border pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{r.customerName}</p>
              <p className="text-xs text-muted-foreground">{formatDate(r.date)}</p>
            </div>
            <p className="mt-1 text-xs font-semibold text-secondary">{r.rating}/5</p>
            <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
          </div>
        ))}

        <LinkButton to="/" full className="mt-6 rounded-none">
          Back to Home
        </LinkButton>
      </div>
    </div>
  );
}
