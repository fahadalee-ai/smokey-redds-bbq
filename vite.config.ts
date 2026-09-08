import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const root = dirname(fileURLToPath(import.meta.url));

/** Use `VITE_BASE=/subdir/` for a nested host; Vercel uses `/`. */
const base = process.env.VITE_BASE || "/";

export default defineConfig({
  base,
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": resolve(root, "src"),
    },
  },
  server: {
    allowedHosts: ["demo.sourapps.com", "localhost", "127.0.0.1"],
  },
  preview: {
    allowedHosts: ["demo.sourapps.com", "localhost", "127.0.0.1"],
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
