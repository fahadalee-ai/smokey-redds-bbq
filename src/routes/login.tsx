import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { useState } from "react";
import { AuthInput, AuthShell, PasswordField, SocialAuth } from "@/components/AuthShell";
import { Button, Field } from "@/components/kit";
import { DEMO_USER } from "@/lib/catalog";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in · Smokey Redd's BBQ" }] }),
  component: Login,
});

function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>(DEMO_USER.email);
  const [password, setPassword] = useState<string>(DEMO_USER.password);
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = login(email, password);
    if (!result.ok) {
      setError("Email or password doesn’t match.");
      return;
    }
    void navigate({ to: "/" });
  }

  function continueDemo() {
    login(DEMO_USER.email, DEMO_USER.password);
    void navigate({ to: "/" });
  }

  return (
    <AuthShell
      variant="login"
      title="Welcome back"
      subtitle="Log in to order, track the truck, and stack loyalty points."
      showBack={false}
    >
      <form onSubmit={onSubmit}>
        <Field label="Email" error={error}>
          <AuthInput
            type="email"
            icon={<Mail size={16} />}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            autoComplete="username"
            required
          />
        </Field>
        <PasswordField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <Link
          to="/forgot"
          className="mb-5 block text-right text-sm text-white/55 underline-offset-4 hover:text-white hover:underline"
        >
          Forgot password?
        </Link>
        <Button type="submit" full className="rounded-none">
          Log in
        </Button>
      </form>
      <SocialAuth onContinue={continueDemo} />
      <p className="mt-6 text-center text-sm text-white/55">
        New here?{" "}
        <Link to="/register" className="font-semibold text-primary">
          Create an account
        </Link>
      </p>
      <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F99B1C]/80">
        Dare to be great
      </p>
      <div className="mt-5 border border-dashed border-white/15 bg-white/[0.04] px-3 py-2.5 text-center text-[11px] leading-relaxed text-white/45">
        Demo · {DEMO_USER.email} / {DEMO_USER.password}
      </div>
    </AuthShell>
  );
}
