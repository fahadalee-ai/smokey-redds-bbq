import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/splash")({
  component: () => <Navigate to="/" replace />,
});
