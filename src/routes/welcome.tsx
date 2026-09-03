import { createFileRoute } from "@tanstack/react-router";
import { OnboardingView } from "@/components/OnboardingView";

export const Route = createFileRoute("/welcome")({
  head: () => ({ meta: [{ title: "Welcome · Smokey Redd's BBQ" }] }),
  component: Welcome,
});

function Welcome() {
  return <OnboardingView />;
}
