// @ts-check
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// astro.config runs before Astro loads .env, so read it explicitly; a shell variable still wins.
const env = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "PUBLIC_");
const site = process.env.PUBLIC_SITE_URL || env.PUBLIC_SITE_URL || "http://localhost:4321";

// Fully static: two prerendered pages (/ and /ar) and a robots.txt endpoint. No adapter, no server.
export default defineConfig({
  site,
  output: "static",
  trailingSlash: "ignore",

  integrations: [
    sitemap({
      i18n: { defaultLocale: "fr", locales: { fr: "fr-TN", ar: "ar-TN" } },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    // @lucide/astro ships .astro/.ts sources; pre-bundling it for SSR produces
    // "file does not exist in the optimize deps directory" 500s in dev.
    optimizeDeps: { exclude: ["@lucide/astro"] },
    ssr: { noExternal: ["@lucide/astro"] },
  },

  i18n: {
    defaultLocale: "fr",
    locales: ["fr", "ar"],
    routing: { prefixDefaultLocale: false },
  },

  build: { inlineStylesheets: "auto" },
});
