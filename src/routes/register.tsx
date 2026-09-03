import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Cake, Mail, Phone, User } from "lucide-react";
import { useState } from "react";
import { AuthInput, AuthShell, PasswordField, SocialAuth } from "@/components/AuthShell";
import { Button, Field } from "@/components/kit";
import { DEMO_USER } from "@/lib/catalog";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account · Smokey Redd's BBQ" }] }),
  component: Register,
});

function Register() {
  const { register, login } = useApp();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = register({ firstName, lastName, email, phone, password, birthday });
    if (!result.ok) {
      setError("That email is already in use.");
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
      variant="register"
      title="Create your account"
      subtitle="Join for pickup, delivery, and a birthday perk on the house."
    >
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name">
            <AuthInput
              icon={<User size={16} />}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
              required
            />
          </Field>
          <Field label="Last name">
            <AuthInput
              icon={<User size={16} />}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
              required
            />
          </Field>
        </div>
        <Field label="Email" error={error}>
          <AuthInput
            type="email"
            icon={<Mail size={16} />}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            autoComplete="email"
            required
          />
        </Field>
        <Field label="Phone">
          <AuthInput
            type="tel"
            icon={<Phone size={16} />}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            required
          />
        </Field>
        <div className="mb-4 flex items-start gap-3 border border-[#F99B1C]/25 bg-[#F99B1C]/10 px-3 py-3">
          <Cake size={16} className="mt-0.5 shrink-0 text-[#F99B1C]" />
          <p className="text-xs leading-relaxed text-white/75">
            Add your birthday — unlocks a free side the week of your birthday.
          </p>
        </div>
        <Field label="Birthday">
          <AuthInput
            type="date"
            icon={<Cake size={16} />}
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </Field>
        <PasswordField label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        <Button type="submit" full className="rounded-none">
          Create account
        </Button>
      </form>
      <SocialAuth onContinue={continueDemo} label="or sign up with" />
      <p className="mt-6 text-center text-sm text-white/55">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-primary">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
