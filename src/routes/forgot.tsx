import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Mail } from "lucide-react";
import { useState } from "react";
import { AuthInput, AuthShell } from "@/components/AuthShell";
import { Button, Field, LinkButton } from "@/components/kit";

export const Route = createFileRoute("/forgot")({
  head: () => ({ meta: [{ title: "Reset password · Smokey Redd's BBQ" }] }),
  component: Forgot,
});

function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <AuthShell
      variant="forgot"
      title={sent ? "Check your inbox" : "Reset password"}
      subtitle={
        sent
          ? "If that email is on an account, a reset link is on the way."
          : "Enter the email on your account. We’ll send a reset link if we find a match."
      }
    >
      {sent ? (
        <div className="border border-white/12 bg-white/[0.05] px-4 py-6 text-center">
          <CheckCircle2 className="mx-auto text-[#F99B1C]" size={36} strokeWidth={1.75} />
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            We sent instructions to <span className="font-semibold text-white">{email}</span>. Check spam if it
            doesn’t show in a few minutes.
          </p>
          <LinkButton to="/login" full className="mt-5 rounded-none">
            Back to log in
          </LinkButton>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <Field label="Email">
            <AuthInput
              type="email"
              icon={<Mail size={16} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </Field>
          <Button type="submit" full className="rounded-none">
            Send reset link
          </Button>
          <p className="mt-5 text-center text-sm text-white/55">
            Remembered it?{" "}
            <Link to="/login" className="font-semibold text-primary">
              Log in
            </Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}
