import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#0a0a0a]">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col overflow-x-hidden bg-background text-foreground">
        <main className="relative flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
