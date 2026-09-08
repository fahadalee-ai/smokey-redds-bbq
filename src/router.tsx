import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const rawBase = import.meta.env.BASE_URL || "/";
const basepath = rawBase === "/" ? "/" : rawBase.replace(/\/$/, "");

export const getRouter = () => {
  const queryClient = new QueryClient();

  return createRouter({
    routeTree,
    context: { queryClient },
    basepath,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    trailingSlash: "never",
  });
};
