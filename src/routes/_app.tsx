import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { TabBar } from "@/components/mobile/TabBar";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_app")({
  component: AppTabs,
});

function AppTabs() {
  const { user, hydrated, onboarded } = useApp();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onHome = pathname === "/";

  useEffect(() => {
    if (!hydrated || onHome) return;
    if (!onboarded) void navigate({ to: "/welcome", replace: true });
    else if (!user) void navigate({ to: "/login", replace: true });
  }, [hydrated, onboarded, user, onHome, navigate]);

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex-1">
        <Outlet />
      </div>
      {hydrated && onboarded && user ? <TabBar /> : null}
    </div>
  );
}
